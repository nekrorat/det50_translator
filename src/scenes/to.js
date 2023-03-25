const {
  Scenes: {
    BaseScene
  }
} = require('telegraf');

const getLangCheck = require('../js/lang-check');
const cancelCommand = require('../commands/cancel');

const to = new BaseScene('to');

to.enter((ctx) => {
  ctx.reply('Hi. Please set a language code for /to language');
});

to.command('cancel', (ctx) => {
  cancelCommand(ctx);
});

to.on('text', async (ctx) => {
  try {
    const ctxMessage = ctx.message.text.toLowerCase();

    const result = await getLangCheck(ctxMessage);

    // fic -> fix the bug that throw Google Translate API error when both TO and FROM languages are the same
    (ctx.session.from == result.langCode) ? result.langBool = false : result.langBool;

    if (!result.langBool) {
      if (result.ctxMessage == 'auto') {
        return ctx.reply(`Auto-detection cannot be set for the output (TO) language\n\nTry again or text /cancel to go back to the main menu`);
      } else if (ctx.session.from == result.langCode) {
        return ctx.reply('The output (TO) language cannot be same as the source (FROM) language\n\nChoose another language or text /cancel to go back to the main menu');
      }
      return ctx.reply('Language is not supported or incorrect spelling\n\nTry again or text /cancel to go back to the main menu');
    } else {
      ctx.session.to = result.ctxMessage;
      ctx.replyWithMarkdown(`*${result.langName}* set as the output (TO) language\n\nText /check to check the current language pair`);
      return ctx.scene.leave();
    }
  } catch (error) {
    console.log(error);
    return ctx.reply('Error');
  }
});
// to.leave((ctx) => {
//     //ctx.reply('Done');
// });

to.on('message', (ctx) => ctx.reply('Only text is allowed\nText a message or text /cancel to go back to the main menu'));

module.exports = to;