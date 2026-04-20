import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'media-platform-server',
    brokers: ['localhost:9092']
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'projection-group'});

export const connectKafka = async () => {
    await consumer.connect();
    await producer.connect();
    console.log('Kafka Connected');
};