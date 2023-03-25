// commands
const startCommand = require('../commands/start');
const helpCommand = require('../commands/help');

// buttons
const {
  startButton,
  demoButton,
  backToMainMenuButton,
  changeLang,
} = require('./buttons');

const callButtonHelp = (ctx) => {
  ctx.deleteMessage();
  ctx.reply(helpCommand(), backToMainMenuButton(ctx));
};

const callButtonDemo = (ctx) => {
  ctx.deleteMessage();
  ctx.reply('You can use the bot in many ways.\nPlease select one of the demonstrations of how-to:', demoButton());
};

const callButtonBack = async (ctx) => {
  try {
    ctx.deleteMessage();
    const message = await startCommand(ctx);
    ctx.replyWithHTML(message, startButton());
  } catch (error) {
    console.log(error);
  }
};

const callButtonFrom = (ctx) => {8
  ctx.deleteMessage();
  ctx.reply('Please select source language', changeLang(ctx.session.to, true));
};

const callButtonTo = (ctx) => {
  ctx.deleteMessage();
  ctx.reply('Please select target language', changeLang(ctx.session.from, false));
};

const callButtonPic = (ctx) => {
  ctx.deleteMessage();
  ctx.scene.enter('pic');
};

const callLangButton = async (ctx, code, name) => {
  try {
    ctx.deleteMessage();
    if (ctx.update.callback_query.message.text == `Please select source language`) {
      ctx.answerCbQuery(`Set FROM: ${name}`);
      ctx.session.from = `${code}`;
    } else {
      ctx.answerCbQuery(`Set TO: ${name}`);
      ctx.session.to = `${code}`;
    }
    const message = await startCommand(ctx);
    ctx.replyWithHTML(message, startButton());
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  callButtonHelp,
  callButtonDemo,
  callButtonBack,
  callButtonFrom,
  callButtonTo,
  callButtonPic,
  callLangButton,
};
