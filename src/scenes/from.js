const {Scenes: {BaseScene}} = require('telegraf');

const getLangCheck = require('../js/lang-check');
const cancelCommand = require('../commands/cancel');

const from = new BaseScene('from');

from.enter((ctx) => {
  ctx.reply('Please set source language');
});

from.command('cancel', (ctx) => {
  cancelCommand(ctx);
});

from.on('text', async (ctx) => {
  try {
    const ctxMessage = ctx.message.text.toLowerCase();

    const result = await getLangCheck(ctxMessage);

    // set value true for Auto-Detection
    (result.ctxMessage == 'auto') ? result.langBool = true : result.langBool;

    // fic -> fix the bug that throw Google Translate API error when both TO and FROM languages are the same
    (ctx.session.to == result.langCode) ? result.langBool = false : result.langBool;

    if (!result.langBool) {
      if (ctx.session.to == result.langCode) {
        return ctx.reply('The source (FROM) language cannot be same as the output (TO) language\n\nChoose another language or text /cancel to go back to the main menu');
      }
      return ctx.reply('Language is not supported or incorrect spelling\n\nTry again or text /cancel to go back to the main menu ');
    } else if (result.ctxMessage == 'auto') {
      result.ctxMessage = '';
      ctx.session.from = result.ctxMessage;
      ctx.replyWithMarkdown('*Auto-detection* set as the output (TO) language\n\nText /check to check the current language pair');
      return ctx.scene.leave();
    }
    ctx.session.from = result.ctxMessage;
    ctx.replyWithMarkdown(`*${result.langName}* set as the source (FROM) language\n\nText /check to check the current language pair`);
    return ctx.scene.leave();
  } catch (error) {
    console.log(error);
    return ctx.reply('Error');
  }
});
// from.leave((ctx) => {
//     //ctx.reply('Done');
// });

from.on('message', (ctx) => ctx.reply('Only text is allowed. Text a message or text /cancel to go back to the main menu.'));

module.exports = from;
