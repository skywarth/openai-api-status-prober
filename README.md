# OpenAI API Status Prober

This is a simple web service that you can use to probe openAI API status and integrate it into your prometheus server.

https://openai-api-status-prober.onrender.com/open-ai-status-prober/simplified_status

## Installation


There is three different methods as to consume this API.
1. Self Hosting - Global installation (TL;DR get it working ASAP)
2. Self Hosting - Local Installation
3. Use production deployment directly (please don't overload)

### 1. TL;DR get it working ASAP.

0. Install `pm2`, this method relies on [PM2](https://pm2.keymetrics.io/) to start and keep itself running.

```bash
npm install -g pm2
```

1. Install the package **globally**

```bash
npm install -g openai-api-status-prober
```

2. Start the service

Serve it via `pm2`:
```bash
openai-api-status-prober start
```

Set `pm2` as a system service (if you haven't already):
```bash
pm2 startup
```

Save `pm2` configuration and jobs
```bash
pm2 save
```

3. Enjoy

You may access the API via default port (9091) and default endpoint (/open-ai-status-prober/simplified_status). For your local, that would be: 

http://localhost:9090/open-ai-status-prober/simplified_status

---





## Why?

Because the [official API](https://status.openai.com/api/v2) for probing/fetching the API status of the openAI returns HTTP code 200 whether it's down or up. But for Prometheus Blackbox exporter, you need an endpoint that can return 200/500/3xx depending on the status.

This little prober works as a proxy for the actual [openAI API status](https://status.openai.com/api/v2) and translates its response to corresponding HTTP response status codes, this way you can easily integrate openAI as a target for your Prometheus Blackbox exporter. 