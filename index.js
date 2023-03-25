// telegraf
const { Telegraf, Scenes } = require('telegraf');

// google 
const { Datastore } = require('@google-cloud/datastore');

// other
const datastoreSession = require('telegraf-session-datastore');

// files +++++
// services
const { downloadFile } = require('./src/services/storage');

// commands
const startCommand = require('./src/commands/start');
const helpCommand = require('./src/commands/help');
const checkCommand = require('./src/commands/check');

// scenes
const fromScene = require('./src/scenes/from');
const toScene = require('./src/scenes/to');
const picScene = require('./src/scenes/pic');

// handlers
const messageHandler = require('./src/handlers/message');
const inlineQueryHandler = require('./src/handlers/inlineQuery');

// buttons
const {
  startButton,
} = require('./src/js/buttons');

// callbacks
const {
  callButtonHelp,
  callButtonDemo,
  callButtonBack,
  callButtonFrom,
  callButtonTo,
  callButtonPic,
  callLangButton,
} = require('./src/js/callbacks');
// files -----

//* TEST OR PROD +++++
const isGoogleCloudEnv = !!process.env.NODE_ENV
let ds, TSL;
if (isGoogleCloudEnv) {
  //* PROD
  console.log(`PROD: isGoogleCloudEnv = ${isGoogleCloudEnv}`);
  // datastore
  ds = new Datastore();
} else {
  //* LOCAL
  console.log(`TEST: isGoogleCloudEnv = ${isGoogleCloudEnv}`);
  require('dotenv').config();
  // local session
  TSL = require('telegraf-session-local');
}
//* TEST OR PROD -----

// telegram token
const { BOT_TOKEN } = process.env;

//& EXEC
const init = async (bot, config) => {
  // stage, scenes
  const stage = new Scenes.Stage([fromScene, toScene, picScene]);

  // middleware
  //bot.use(stage.middleware());

  // session
  if (isGoogleCloudEnv) {
    //* PROD
    bot.use(datastoreSession(ds));
  } else {
    //* LOCAL
    bot.use(new TSL({
      database: 'data/session.json'
    }).middleware());
  }

  bot.use(stage.middleware());

  // commands
  bot.start(async (ctx) => {
    try {
      const message = await startCommand(ctx);
      ctx.replyWithHTML(message, startButton());
    } catch (error) {
      console.log(error);
    }
  });

  bot.help((ctx) => {
    ctx.reply(helpCommand());
  });

  bot.command('from', (ctx) => {
    ctx.scene.enter('from');
  });

  bot.command('to', (ctx) => {
    ctx.scene.enter('to');
  });

  bot.command('pic', (ctx) => {
    ctx.scene.enter('pic');
  });

  bot.command('check', async (ctx) => {
    try {
      const {
        fromLang,
        toLang
      } = await checkCommand(ctx);
      return ctx.replyWithMarkdown(`*${fromLang}* --> *${toLang}*`);
    } catch (error) {
      console.log(error);
    }
  });

  // handlers
  bot.on('message', messageHandler());
  bot.inlineQuery(/^[^\/]+/, inlineQueryHandler());

  // inline query to go from inline to the bot
  bot.inlineQuery(['/to', '/from'], ctx => {
    let result = [];
    ctx.answerInlineQuery(result, {
      cache_time: 60,
      is_personal: true,
      switch_pm_text: 'Change language',
      switch_pm_parameter: 'change-language'
    });
  });

  // callbacks
  bot.action('help', (ctx) => {
    callButtonHelp(ctx);
  });
  bot.action('back', (ctx) => {
    callButtonBack(ctx);
  });
  bot.action('from', (ctx) => {
    callButtonFrom(ctx);
  });
  bot.action('to', (ctx) => {
    callButtonTo(ctx);
  });
  bot.action('pic', (ctx) => {
    callButtonPic(ctx);
  });
  bot.action('auto', (ctx) => {
    callLangButton(ctx, '', 'Auto-detection');
  });
  bot.action('en', (ctx) => {
    callLangButton(ctx, 'en', 'English');
  });
  bot.action('ru', (ctx) => {
    callLangButton(ctx, 'ru', 'Russian');
  });
  bot.action('uk', (ctx) => {
    callLangButton(ctx, 'uk', 'Ukrainian');
  });

  // demo buttons +++++
  bot.action('demo', async (ctx) => {
    callButtonDemo(ctx)
  });

  bot.action('translate_picture', async (ctx) => {
    const demoFile = await downloadFile('demo/translate_picture.gif').catch(console.error)
    ctx.replyWithAnimation({
      source: demoFile[0]
    });
    ctx.answerCbQuery();
  });

  bot.action('inline_tr_demo', async (ctx) => {
    const demoFile = await downloadFile('demo/inline_tr_demo.gif').catch(console.error)
    ctx.replyWithAnimation({
      source: demoFile[0]
    });
    ctx.answerCbQuery();
  });

  bot.action('translate_demo', async (ctx) => {
    const demoFile = await downloadFile('demo/translate_demo.gif').catch(console.error)
    ctx.replyWithAnimation({
      source: demoFile[0]
    });
    ctx.answerCbQuery();
  });

  bot.action('forward_tr_demo', async (ctx) => {
    const demoFile = await downloadFile('demo/forward_tr_demo.gif').catch(console.error)
    ctx.replyWithAnimation({
      source: demoFile[0]
    });
    ctx.answerCbQuery();
  });

  bot.action('change_language', async (ctx) => {
    const demoFile = await downloadFile('demo/change_language.gif').catch(console.error)
    ctx.replyWithAnimation({
      source: demoFile[0]
    });
    ctx.answerCbQuery();
  });
  // demo buttons -----

  return bot;
};

init(new Telegraf(BOT_TOKEN), process.env)
  .then(async (bot) => {

    if (isGoogleCloudEnv) {
      //* PROD
      await bot.launch({
        webhook: {
          domain: process.env.URL,
          port: process.env.PORT || 5000,
        }
      });
    } else {
      //* TEST
      await bot.launch();
    };

    console.log(`Launched ${new Date()}`);
  })
  .catch((error) => console.log(error));

module.exports = init;