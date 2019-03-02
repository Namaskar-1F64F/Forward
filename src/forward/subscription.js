import Logger from '../util/Logger';
import { getSubscription, addSubscription, removeSubscription } from './database';

export const add = async (telegramId, slackId) => {
  try {
    if (await getSubscription(telegramId) == null) {
      return await addSubscription(telegramId, slackId);
    }
  }
  catch (err) {
    Logger.error(`Tried to add chat with ID ${telegramId} for chat ${slackId}, but got an error: ${err}`);
  }
  return false;
};

export const stop = (telegramId) => {
  removeSubscription(telegramId);
};