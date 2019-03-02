import { MongoClient } from 'mongodb';
import Logger from '../util/logger';

let mongoClient;

export const initialize = async () => {
  try {
    mongoClient = await MongoClient.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true });
    return true;
  } catch (error) {
    Logger.error(error.stack);
    return false;
  }
}

const getCollection = (collection = 'Chat') => {
  return mongoClient.db('Forward').collection(collection);
}

export const addSubscription = async (id, otherId) => {
  try {
    if (id == null || otherId == null) return false;
    id = String(id);
    Logger.info(`DB: addSubscription with chat ID ${id}.`);
    await getCollection().updateOne({ id }, { $set: { id, otherId } }, { upsert: true });
    return true;
  } catch (error) {
    Logger.error(error.stack);
    return false;
  }
}

export const getSubscription = async (id) => {
  try {
    id = String(id);
    Logger.info(`DB: getSubscription with id ${id}.`);
    const subscription = await getCollection().findOne({ id });
    Logger.info(JSON.stringify(subscription));
    if (subscription) return subscription;
    Logger.error(`Could not find subscription with id ${id}`);
    return null;
  } catch (error) {
    Logger.error(error.stack);
    return null;
  }
}

export const removeSubscription = async (id) => {
  try {
    id = String(id);
    Logger.info(`DB: removeSubscription with id ${id}.`);
    await getCollection().remove({ id });
    return true
  }
  catch (error) {
    Logger.error(error.stack);
    return false;
  }
}
