Hey thanks for stopping by!
Forward is used to take messages from (currently slack or telegram) and forward them to (currently slack or telegram) to run this yoruself, you will need to create a slack app, add a bot account, listen to the message event, add a webhook URL, make a telegram bot, get a mongdb database with a 'Forward' database with a 'Chat'  collection, and fill in these environment variables:

```
MONGO_CONNECTION_STRING
FORWARD_SLACK_TOKEN
SLACK_SIGNING_SECRET
FORWARD_TELEGRAM_TOKEN
```

### Running
```
yarn
yarn start
```
