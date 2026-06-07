import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'media-platform-server',
    brokers: ['localhost:9092'],
});

export const producer = kafka.producer();

/**
 * Each worker needs its own consumer instance with a unique groupId.
 * A single Kafka consumer can only subscribe to topics once.
 * Sharing one consumer across workers would cause subscription conflicts.
 */
export const createConsumer = (groupId: string) => {
    return kafka.consumer({ groupId });
};

export const connectKafka = async () => {
    await producer.connect();
    console.log('Kafka producer connected');
};
