import amqp from "amqplib";
// The Connection
let connection;
// Queues for KDS, Inventory and Rider
let marketplaceToKdsQueue = "marketplaceToKDS";
let marketplaceToInventoryQueue = "marketplaceToInventory";
let marketplaceToRiderQueue = "marketplaceToRider";
// Channels for KDS, Inventory and Rider
let channelForKDS;
let channelForInventory;
let channelForRider;
// Connect and Create rabbit mq channel and connection on server startup. This function is being called in index.ts
export async function connectToMQ() {
    try {
        const ampqServer = (process.env.AMPQ_URL);
        connection = await amqp.connect(ampqServer);
    }
    catch (err) {
        console.log(err);
    }
}
// Close rabbitmq connection and channel. This function is being called in index.ts
export async function closeMQConnection() {
    try {
        if (connection)
            await connection.close();
    }
    catch (error) {
        console.log(error);
    }
}
// sending the order in MQ for KDS
export async function sendOrderToKDS(data) {
    try {
        console.log('before sending to KDS - KDS DATA -----------------------------------------------', data);
        console.log('---------------------------------------------------------');
        channelForKDS = await connection.createChannel();
        await channelForKDS.assertQueue(marketplaceToKdsQueue, { durable: false });
        channelForKDS.sendToQueue(marketplaceToKdsQueue, Buffer.from(JSON.stringify(data)));
    }
    catch (error) {
        console.log(error);
    }
    finally {
        if (channelForKDS)
            await channelForKDS.close();
    }
}
// Sending order in MQ for Rider 
export async function sendToRider(data) {
    try {
        console.log('before sending to RIDER - RIDER DATA -----------------------------------------------', data);
        console.log('------------------------------------------------------------------------');
        channelForRider = await connection.createChannel();
        await channelForRider.assertQueue(marketplaceToRiderQueue, { durable: false });
        channelForRider.sendToQueue(marketplaceToRiderQueue, Buffer.from(JSON.stringify(data)));
    }
    catch (error) {
        console.log(error);
    }
    finally {
        if (channelForRider)
            await channelForRider.close();
    }
}
// sending order in MQ for Inventory
export async function sendToInventory(data) {
    try {
        console.log('before sending in INVENTORY - Inventory Compressed -------------------------------------------------', data);
        console.log('------------------------------------------------------------------');
        channelForInventory = await connection.createChannel();
        await channelForInventory.assertQueue(marketplaceToInventoryQueue, { durable: false });
        channelForInventory.sendToQueue(marketplaceToInventoryQueue, Buffer.from(JSON.stringify(data)));
    }
    catch (error) {
        console.log(error);
    }
    finally {
        if (channelForInventory)
            await channelForInventory.close();
    }
}
//# sourceMappingURL=orderMQ.service.js.map