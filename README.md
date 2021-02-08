# k6

## Goal
- https://k6.io/
- Samples https://github.com/loadimpact/k6/tree/master/samples
- Awesome https://github.com/k6io/awesome-k6
- Apache Kafka https://medium.com/k6-io/integrating-k6-with-apache-kafka-eda96ea7c749
- Tool review 2020 https://k6.io/blog/comparing-best-open-source-load-testing-tools

- research k6.io
- POC
-   REST API (elasticsearch)
-   live logging to elasticsearch
-   Web App
-   Distrib 
- dockerize (dockerizovano jiz je)
- deploy to k8


# Installation
- `docker pull loadimpact/k6`
- `brew install k6`

# How To Run
`docker run --name k6 -i --rm loadimpact/k6 run - < testCases/k6io.js --vus 10 --duration 30s`

# How To Run with ENV
`docker run --name k6 -i --rm -e SERVER=192.168.1.176 -e PORT=9200 rdpanek/k6:0.26.2 run - < elasticsearch/elasticsearch.js`

# Convert HAR to K6 test
`k6 convert -O elasticsearch/syntexHomePage.js /Users/rdpanek/HTDOCS/teststack/k6/elasticsearch/har/www.syntex.cz.har`

# Notes


- test summary / metrics guide https://k6.io/docs/using-k6/metrics
- features https://hub.docker.com/r/loadimpact/k6/
- output plugins https://k6.io/docs/getting-started/results-output#output-plugins
- docker image ma pouhych 33.6MB
- cloud a opensource verze
- [k6control](https://k6.io/blog/building-a-ui-for-the-k6-load-testing-tool)
- WM primo v testu nebo v konfiguracnim souboru bokem
- podpora pouze http1, http2 a WS
- tezko rict, jak si K6 poradi s csv data setem o 40.000 zaznamech, kdyz to nacita javascript
- Cloud execution and distributed tests (currently only on infrastructure managed by Load Impact, with native distributed execution in k6 planned for the near future!)
```
export let options = {
  ext: {
    loadimpact: {
      name: 'Hello k6 cloud!',
      distribution: {
        scenarioLabel1: { loadZone: 'amazon:us:ashburn', percent: 50 },
        scenarioLabel2: { loadZone: 'amazon:ie:dublin', percent: 50 },
      },
    },
  },
};
```
- konverze z HAR, postman, jmeter, Swagger/OpenAPI