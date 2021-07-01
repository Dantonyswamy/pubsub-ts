
const topicName = 'pubsub-ts-topic';
const data = JSON.stringify({welcome_text: 'Hello there. This is a message from PubSub'});

// Imports the Google Cloud client library
import {PubSub} from '@google-cloud/pubsub'

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function publishMessage() {
  // Publishes the message as a string, e.g. JSON.stringify(data)
  const dataBuffer = Buffer.from(data);

  try {
    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
    process.exitCode = 1;
  }
}

publishMessage();

 const subscriptionName = 'pubsub-ts-subscribe';
 const timeout = 60;

function listenForMessages() {
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message: { id: any; data: any; attributes: any; ack: () => void; }) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
}

listenForMessages();