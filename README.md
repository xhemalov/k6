# k6.io
> https://k6.io/ Open source load testing tool and SaaS for engineering teams


# How to get
- `docker pull loadimpact/k6` or for OSX
- `brew install k6`

# How To Run
- `k6 run baseline.js` or
- `docker run --name k6 -i --rm -v $(pwd):/home/k6/ loadimpact/k6:0.31.1 run baseline.js --no-usage-report`

### How to run with clone public git repository with tests**
> this command download repository, checkout on revision and run k6
- `docker run --name k6 -it --rm -e GIT_TEST_REPOSITORY=https://github.com/rdpanek/k6.git -e GIT_REVISION=04a28b8 quay.io/rdpanek/k6:1.0.1`

**ENV for clone repository with tests and run k6**

- `GIT_TEST_REPOSITORY` e.g. https://github.com/rdpanek/k6.git
- `GIT_REVISION` e.q. `04a28b8`
- `TEST_PLAN_NAME` e.q. `baseline.js`, default is `baseline.js`

**Run with local tests**

You can run tests from your localhost.
```
docker run --name k6 -it --rm --net k6 -v $(pwd):/home/k6/ -e ENV_PRINT=allow quay.io/rdpanek/k6:0.33.0.1
```
- `TEST_PLAN_NAME` e.q. `baseline.js`, default is `baseline.js`

# How to run in k8s

- create namespace `kubectl create namespace k6`
- update count of replicas in `k8s/deployment.yaml`


# Convert HAR to K6 test
`k6 convert -O elasticsearch/syntexHomePage.js /Users/rdpanek/HTDOCS/teststack/k6/elasticsearch/har/www.syntex.cz.har`

## Notes

- test summary / metrics guide https://k6.io/docs/using-k6/metrics
- features https://hub.docker.com/r/loadimpact/k6/
- output plugins https://k6.io/docs/getting-started/results-output#output-plugins
- k6 crypto https://k6.io/docs/javascript-api/k6-crypto
- sharedArray https://k6.io/docs/javascript-api/k6-data/sharedarray
- parseResponse https://k6.io/docs/javascript-api/k6-html/parsehtml-src
- ip aliasing https://k6.io/docs/using-k6/options#local-ips
- js libraries https://jslib.k6.io/
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

## Bookmarks
- https://k6.io/
- Samples https://github.com/loadimpact/k6/tree/master/samples
- Awesome https://github.com/k6io/awesome-k6
- Apache Kafka https://medium.com/k6-io/integrating-k6-with-apache-kafka-eda96ea7c749
- Tool review 2020 https://k6.io/blog/comparing-best-open-source-load-testing-tools


## Prometheus & Grafana

0). Run test web
```bash
docker run -d --rm -p 80:80 -p 443:443 --net k6 --name battle quay.io/canarytrace/battle-page:1.1
```


1). Build k6 with xk6-prometheus

- https://github.com/szkiba/xk6-prometheus
  - Build or download https://github.com/k6io/xk6/releases

```bash
# build
./xk6_0.4.1_mac_amd64/xk6 build --with github.com/szkiba/xk6-prometheus@latest
```

2). Run k6 with prometheus module

```bash
./k6 run baseline.js --out 'prometheus=namespace=k6' --no-usage-report
```

3). endpoint `/metrics` are available on `5656` port

- http://localhost:5656/metrics

4). prepare Prometheus configuration

- `prometheus/prometheus.yml`

5). run Prometheus

```bash
docker run --name prometheus --net k6 -d --rm -v $(PWD)/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml -p 9090:9090 prom/prometheus  
```

and check that target k6 us up http://localhost:9090/targets

6). Run Grafana

```bash
docker run -d --rm --net k6 --name grafana -p 3000:3000 grafana/grafana
```

7). Login to Grafana and import dashboard

- http://localhost:3000/
- import dashboard from `grafana/` directory

## K6 with prometheus

1). Build
```bash
docker build -t quay.io/rdpanek/k6:0.33.0-prometheus -f Dockerfile-prometheus .
```

2). Run from localhost

```bash
docker run --name k6 --rm -it -v $(pwd):/opt --net k6 --entrypoint /bin/sh -p 5656:5656 quay.io/rdpanek/k6:0.33.0-prometheus
```

3). Run from localhost with prometheus HTTP exporter

```bash
docker run --name k6 --rm -it -v $(pwd):/opt --net k6 -p 5656:5656 -e TEST_PLAN_NAME=baseline.js quay.io/rdpanek/k6:0.33.0-prometheus
```