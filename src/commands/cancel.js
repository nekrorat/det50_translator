const { startButton } = require('../js/buttons');
const startCommand = require('./start');

module.exports = async (ctx) => {
    ctx.scene.leave();
    try {
        const message = await startCommand(ctx);
        ctx.replyWithHTML(message, startButton());
      } catch (error) {
        console.log(error);
      }
  };
  