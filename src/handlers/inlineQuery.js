const {getTranslation} = require('../services/translate');

module.exports = () => async (ctx) => {
  if (!ctx.inlineQuery.query) return;

  try {
    // fix -> if launch the bot for the first time thru inline query, before translation within the bot channel, results error
    ctx.session.to = ctx.session.to || 'en';
    ctx.session.from = ctx.session.from || '';

    const result = await getTranslation(ctx.inlineQuery.query, ctx.session.from, ctx.session.to);

    // Display "auto" in the pop-up menu description, when auto-detection is selected
    let fromDescription;
    if (!ctx.session.from) {
      fromDescription = 'auto';
    } else {
      fromDescription = ctx.session.from;
    }

    return ctx.answerInlineQuery([
      {
        type: 'article',
        id: ctx.inlineQuery.id,
        title: result + '',
        description: `${fromDescription} --> ${ctx.session.to}`,
        input_message_content: {
          message_text: result + '',
        },
      },
    ]);
  } catch (e) {
    if (e.code === 3) {
      console.log(e);

      return ctx.answerInlineQuery([
        {
          type: 'article',
          id: ctx.inlineQuery.id,
          title: 'Change source or target language and try again.',
          description: JSON.stringify(e.details + ''),
          input_message_content: {
            message_text: JSON.stringify(e.details + ''),
          },
        },
      ]);
    }
    return ctx.answerInlineQuery([
      {
        type: 'article',
        id: ctx.inlineQuery.id,
        title: 'Error',
        description: JSON.stringify(e),
        input_message_content: {
          message_text: JSON.stringify(e.details),
        },
      },
    ]);
  }
};
