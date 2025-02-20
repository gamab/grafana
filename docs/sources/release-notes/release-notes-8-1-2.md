+++
title = "Release notes for Grafana 8.1.2"
[_build]
list = false
+++

<!-- Auto generated by update changelog github action -->

# Release notes for Grafana 8.1.2

### Features and enhancements

- **AzureMonitor:** Add support for PostgreSQL and MySQL Flexible Servers. [#38075](https://github.com/grafana/grafana/pull/38075), [@joshhunt](https://github.com/joshhunt)
- **Datasource:** Change HTTP status code for failed datasource health check to 400. [#37895](https://github.com/grafana/grafana/pull/37895), [@stephaniehingtgen](https://github.com/stephaniehingtgen)
- **Explore:** Add span duration to left panel in trace viewer. [#37806](https://github.com/grafana/grafana/pull/37806), [@connorlindsey](https://github.com/connorlindsey)
- **Plugins:** Use file extension allowlist when serving plugin assets instead of checking for UNIX executable. [#37688](https://github.com/grafana/grafana/pull/37688), [@wbrowne](https://github.com/wbrowne)
- **Profiling:** Support binding pprof server to custom network interfaces. [#36580](https://github.com/grafana/grafana/pull/36580), [@cinaglia](https://github.com/cinaglia)
- **Search:** Make search icon keyboard navigable. [#37865](https://github.com/grafana/grafana/pull/37865), [@tskarhed](https://github.com/tskarhed)
- **Template variables:** Keyboard navigation improvements. [#38001](https://github.com/grafana/grafana/pull/38001), [@tskarhed](https://github.com/tskarhed)
- **Tooltip:** Display milliseconds (ms) within minute time range. [#37569](https://github.com/grafana/grafana/pull/37569), [@nikki-kiga](https://github.com/nikki-kiga)

### Bug fixes

- **Alerting:** Fix saving LINE contact point. [#37744](https://github.com/grafana/grafana/pull/37744), [@xy-man](https://github.com/xy-man)
- **Alerting:** Fix saving LINE contact point. [#37718](https://github.com/grafana/grafana/pull/37718), [@xy-man](https://github.com/xy-man)
- **Annotations:** Fix alerting annotation coloring. [#37412](https://github.com/grafana/grafana/pull/37412), [@kylebrandt](https://github.com/kylebrandt)
- **Annotations:** Fixes so alert annotations are visible in the correct Panel. [#37959](https://github.com/grafana/grafana/pull/37959), [@hugohaggmark](https://github.com/hugohaggmark)
- **Auth:** Hide SigV4 config UI and disable middleware when its config flag is disabled. [#37293](https://github.com/grafana/grafana/pull/37293), [@wbrowne](https://github.com/wbrowne)
- **Dashboard:** Prevent incorrect panel layout by comparing window width against theme breakpoints. [#37868](https://github.com/grafana/grafana/pull/37868), [@ashharrison90](https://github.com/ashharrison90)
- **Elasticsearch:** Fix metric names for alert queries. [#37871](https://github.com/grafana/grafana/pull/37871), [@dsotirakis](https://github.com/dsotirakis)
- **Explore:** Fix showing of full log context. [#37442](https://github.com/grafana/grafana/pull/37442), [@ivanahuckova](https://github.com/ivanahuckova)
- **PanelEdit:** Fix 'Actual' size by passing the correct panel size to Das…. [#37885](https://github.com/grafana/grafana/pull/37885), [@ashharrison90](https://github.com/ashharrison90)
- **Plugins:** Fix TLS data source settings. [#37797](https://github.com/grafana/grafana/pull/37797), [@wbrowne](https://github.com/wbrowne)
- **Variables:** Fix issue with empty drop downs on navigation. [#37776](https://github.com/grafana/grafana/pull/37776), [@hugohaggmark](https://github.com/hugohaggmark)
- **Variables:** Fix URL util converting `false` into `true`. [#37402](https://github.com/grafana/grafana/pull/37402), [@simPod](https://github.com/simPod)

### Plugin development fixes & changes

- **Toolkit:** Fix matchMedia not found error. [#37643](https://github.com/grafana/grafana/pull/37643), [@zoltanbedi](https://github.com/zoltanbedi)
