
import { WebClient } from '@slack/client';
import Logger from '../../util/logger';
import { receiveMessage } from '..';
import InterfaceMessage from '../interfaces/message';
import Connection from '../interfaces/connection';
import { createEventAdapter } from '@slack/events-api';

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

slackEvents.on('error', Logger.error);

Logger.info('Starting slack interface.');
const bot = new WebClient(process.env.FORWARD_SLACK_TOKEN);

slackEvents.start(3000).then(() => {
  Logger.info(`Started listening to slack events.`);
});
Logger.info('Started slack interface succesfully.');

const userMap = new Map();
export const sendSlackMessage = ({ id }, { text, firstName }) => {
  Logger.info(`Sending message to ${id}.`);
  const options = firstName ? { as_user: false, username: firstName } : {};
  bot.chat.postMessage({ ...options, text, channel: String(id) })
    .then(({ ts }) => {
    // `res` contains information about the posted message
    Logger.info(`Message sent: ${ts}`);
  })
  .catch(e=>Logger.warn(e));
}

slackEvents.on('message', async (event) => {
  if (event.type !=  'message') return;
  let user = userMap.get(event.user);
  if (user == null) {
    const users = await bot.users.list();
    user = users.members.find(member => member.id === event.user);
    if (user == null) return;
    userMap.set(event.user, user);
  }
  Logger.info(JSON.stringify(`New event ${JSON.stringify(event)}.`));
  const { channel, text } = event;
  Logger.info(`${user.profile.first_name} sent a message "${text}" to ${channel}`);
  const interfaceMessage = new InterfaceMessage({ text, firstName: user.profile.first_name, username: user.name });
  const connection = new Connection(event.channel, 'slack');
  receiveMessage(connection, interfaceMessage);
});
