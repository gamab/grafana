import React from 'react';
import { StandardEditorContext, VariableSuggestionsScope } from '@grafana/data';
import { get as lodashGet } from 'lodash';
import { getDataLinksVariableSuggestions } from 'app/features/panel/panellinks/link_srv';
import { OptionPaneRenderProps } from './types';
import { updateDefaultFieldConfigValue, setOptionImmutably } from './utils';
import { OptionsPaneItemDescriptor } from './OptionsPaneItemDescriptor';
import { OptionsPaneCategoryDescriptor } from './OptionsPaneCategoryDescriptor';
import {
  isNestedPanelOptions,
  NestedValueAccess,
  PanelOptionsEditorBuilder,
} from '../../../../../../packages/grafana-data/src/utils/OptionsUIBuilders';
import { PanelOptionsSupplier } from '@grafana/data/src/panel/PanelPlugin';

type categoryGetter = (categoryNames?: string[]) => OptionsPaneCategoryDescriptor;

export function getVizualizationOptions(props: OptionPaneRenderProps): OptionsPaneCategoryDescriptor[] {
  const { plugin, panel, onPanelOptionsChanged, onFieldConfigsChange, data, dashboard, instanceState } = props;
  const currentOptions = panel.getOptions();
  const currentFieldConfig = panel.fieldConfig;
  const categoryIndex: Record<string, OptionsPaneCategoryDescriptor> = {};

  const context: StandardEditorContext<any, any> = {
    data: data?.series || [],
    replaceVariables: panel.replaceVariables,
    options: currentOptions,
    eventBus: dashboard.events,
    getSuggestions: (scope?: VariableSuggestionsScope) => {
      return data ? getDataLinksVariableSuggestions(data.series, scope) : [];
    },
    instanceState,
  };

  const getOptionsPaneCategory = (categoryNames?: string[]): OptionsPaneCategoryDescriptor => {
    const categoryName = (categoryNames && categoryNames[0]) ?? `${plugin.meta.name}`;
    const category = categoryIndex[categoryName];

    if (category) {
      return category;
    }

    return (categoryIndex[categoryName] = new OptionsPaneCategoryDescriptor({
      title: categoryName,
      id: categoryName,
    }));
  };

  const access: NestedValueAccess = {
    getValue: (path: string) => lodashGet(currentOptions, path),
    onChange: (path: string, value: any) => {
      const newOptions = setOptionImmutably(currentOptions, path, value);
      onPanelOptionsChanged(newOptions);
    },
  };

  // Load the options into categories
  fillOptionsPaneItems(plugin.getPanelOptionsSupplier(), access, getOptionsPaneCategory, context);

  /**
   * Field options
   */
  for (const fieldOption of plugin.fieldConfigRegistry.list()) {
    if (
      fieldOption.isCustom &&
      fieldOption.showIf &&
      !fieldOption.showIf(currentFieldConfig.defaults.custom, data?.series)
    ) {
      continue;
    }

    if (fieldOption.hideFromDefaults) {
      continue;
    }

    const category = getOptionsPaneCategory(fieldOption.category);
    const Editor = fieldOption.editor;

    const defaults = currentFieldConfig.defaults;
    const value = fieldOption.isCustom
      ? defaults.custom
        ? lodashGet(defaults.custom, fieldOption.path)
        : undefined
      : lodashGet(defaults, fieldOption.path);

    if (fieldOption.getItemsCount) {
      category.props.itemsCount = fieldOption.getItemsCount(value);
    }

    category.addItem(
      new OptionsPaneItemDescriptor({
        title: fieldOption.name,
        description: fieldOption.description,
        render: function renderEditor() {
          const onChange = (v: any) => {
            onFieldConfigsChange(
              updateDefaultFieldConfigValue(currentFieldConfig, fieldOption.path, v, fieldOption.isCustom)
            );
          };

          return <Editor value={value} onChange={onChange} item={fieldOption} context={context} />;
        },
      })
    );
  }

  return Object.values(categoryIndex);
}

/**
 * This will iterate all options panes and add register them with the configured categories
 *
 * @internal
 */
export function fillOptionsPaneItems(
  supplier: PanelOptionsSupplier<any>,
  access: NestedValueAccess,
  getOptionsPaneCategory: categoryGetter,
  context: StandardEditorContext<any, any>,
  parentCategory?: OptionsPaneCategoryDescriptor
) {
  const builder = new PanelOptionsEditorBuilder<any>();
  supplier(builder, context);

  for (const pluginOption of builder.getItems()) {
    if (pluginOption.showIf && !pluginOption.showIf(context.options, context.data)) {
      continue;
    }

    let category = parentCategory;
    if (!category) {
      category = getOptionsPaneCategory(pluginOption.category);
    } else if (pluginOption.category?.[0]?.length) {
      category = category.getCategory(pluginOption.category[0]);
    }

    // Nested options get passed up one level
    if (isNestedPanelOptions(pluginOption)) {
      const sub = access.getValue(pluginOption.path);
      fillOptionsPaneItems(
        pluginOption.getBuilder(),
        pluginOption.getNestedValueAccess(access),
        getOptionsPaneCategory,
        { ...context, options: sub },
        category // parent category
      );
      continue;
    }

    const Editor = pluginOption.editor;
    category.addItem(
      new OptionsPaneItemDescriptor({
        title: pluginOption.name,
        description: pluginOption.description,
        render: function renderEditor() {
          return (
            <Editor
              value={access.getValue(pluginOption.path)}
              onChange={(value: any) => {
                access.onChange(pluginOption.path, value);
              }}
              item={pluginOption}
              context={context}
            />
          );
        },
      })
    );
  }
}
