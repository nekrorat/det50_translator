const checkCommand = require('../commands/check');

module.exports = async (ctx) => {
  try {
    const {fromLang, toLang} = await checkCommand(ctx);

    const message = `
Hello! This is the @DET50_Translator_bot!
Text /start to call this menu any time.

    Current language settings:
    FROM: <b>${fromLang}</b> --> TO: <b>${toLang}</b>

1. Copy/Paste or Forward a text to the bot chat to translate.
2. If you need to translate a text from a picture, choose "Translate text from picture".
3. Type @DET50_Translator_bot in any chat then start to text right away, the bot will do the rest.

Click 'Demo' for demonstrations of how to use the bot.
`;
    return message;
  } catch (error) {
    console.log(error);
  }
};
