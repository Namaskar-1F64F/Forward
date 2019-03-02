import Logger from '../util/logger';
import { add, stop } from './subscription';
import { initialize, getSubscription } from './database';
import { interfaceEmitter, sendMessage } from '../interface';

initialize().then(async success => {
  if (success) {
    Logger.info(`Connected Forward.`);
    interfaceEmitter.on("message", async (id, message) => {
      Logger.info(`Received message in forward.`);
      const { text, username, title } = message;
      if (text.length > 1 && (text[0] === "/" || text[0] === "!")) {
        const fullCommand = text.substring(1);
        const split = fullCommand.split(' ');
        const command = split[0].toLowerCase();
        const args = split.splice(1);
        Logger.info(`Received command from ${username} in chat ${title} (${id}): ${fullCommand}`);
        return commandHandler(command, args, { id, title });
      }
      const subscription = await getSubscription(id);
      if (subscription != null)
        sendMessage(subscription.otherId, message);
    });

    const commandHandler = (command, args, context) => {
      if (command == null) {
        return;
      } else if (command == 'forward') {
        const [otherId] = args;
        forwardCommand({ ...context, otherId });
      } else if (command == 'stop') {
        stopCommand({ ...context });
      } else if (command == 'id') {
        idCommand({ ...context });
      }
    }

    const forwardCommand = ({ id, otherId }) => {
      if (otherId == null) {
        const message = `I can't forward to a chat if you don't provide the ID, ha!\n\`/forward <ID goes here, dummy>\``;
        Logger.verbose(message);
        sendMessage(id, { text: message }, { parse_mode: 'Markdown' });
        return;
      }
      add(id, otherId).then((success) => {
        if(success)
          return sendMessage(id, { text: `Now forwarding messages to ${id}. You're welcome.` }, { parse_mode: 'Markdown' });
          sendMessage(id, { text: `Dunno why, but I can't forward to ${id}.` }, { parse_mode: 'Markdown' });
      });
    }

    const stopCommand = ({ id }) => {
      stop(id);
      sendMessage(id, { text: `Stopped, forwarding.` });
    }

    const idCommand = ({ id }) => {
      sendMessage(id, { text: id });
    }
  } else {
    Logger.info(`Couldn't connect to db.`);
  }
});
