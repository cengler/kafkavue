# kafkavue

![example workflow](https://github.com/cengler/kafkavue/actions/workflows/test.yml/badge.svg)

## Project setup
```
npm install --global yarn
npm i
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run electron:build
```

## Kafka Docker for dev
```
docker-compose up -d
```
### enter interactively
```
docker exec -it kafkavue_kafka_1 bash
```

### create test data
```
docker exec kafkavue_kafka_1 /opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic caeycae
docker exec -it kafkavue_kafka_1 /opt/bitnami/kafka/bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic caeycae
docker exec -it kafkavue_kafka_1 /opt/bitnami/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic caeycae --from-beginning
```

## Persistent configuration files

### Mac
```
cat ~/Library/Application\ Support/kafkavue/config.json
```

