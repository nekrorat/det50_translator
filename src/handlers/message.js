const {
  getTranslation
} = require('../services/translate');

module.exports = () => async (ctx) => {
  // Fix -> fixing bug that shows languages as undefined on command a message in the chat
  // if a languages hasn't defines yet (on first use of the bot), thru sessions. Default: auto->en
  ctx.session.from = ctx.session.from || '';
  ctx.session.to = ctx.session.to || 'en';

  try {
    // console.log(ctx.message.message_id);

    if (ctx.message.text) {
      const result = await getTranslation(ctx.message.text, ctx.session.from, ctx.session.to);
      return ctx.reply(result + '', {
        disable_web_page_preview: true
      }); // + '' = force to 'string' otherwise json error

      // group media
    } else if (ctx.message.media_group_id) {
      // group media sends multiple messages grouped by media_group_id
      // the condition takes the first message with a caption and ignores the rest
      if (!ctx.message.caption) {
        return ctx;
      }
      const result = await getTranslation(ctx.message.caption, ctx.session.from, ctx.session.to);
      return ctx.reply(result, {
        disable_web_page_preview: true
      });

      // photo
    } else if (ctx.message.photo) {
      if (!ctx.message.caption) {
        return ctx.reply('No text found');
      }
      const result = await getTranslation(ctx.message.caption, ctx.session.from, ctx.session.to);
      console.log(ctx.message);
      return ctx.replyWithPhoto(ctx.message.photo[0].file_id, {
        caption: result + ''
      });

      // video
    } else if (ctx.message.video) {
      if (!ctx.message.caption) {
        return ctx.reply('No text found');
      }
      const result = await getTranslation(ctx.message.caption, ctx.session.from, ctx.session.to);
      return ctx.replyWithVideo(ctx.message.video.file_id, {
        caption: result + ''
      });

      // gif
    } else if (ctx.message.animation) {
      if (!ctx.message.caption) {
        return ctx.reply('No text found');
      }
      const result = await getTranslation(ctx.message.caption, ctx.session.from, ctx.session.to);
      return ctx.replyWithAnimation(ctx.message.document.file_id, {
        caption: result + ''
      });

      // poll
    } else if (ctx.message.poll) {
      // find all options of the poll and put them in array
      const pollOptionsArr = [];
      for (i = 0; i < ctx.message.poll.options.length; i++) {
        pollOptionsArr.push(ctx.message.poll.options[i].text);
      }

      // put question and options in one array
      pollTranslateArr = [ctx.message.poll.question, ...pollOptionsArr];

      // send array for translation
      const result = await getTranslation(pollTranslateArr, ctx.session.from, ctx.session.to); 

      // iterrate array values and set correct text format
      const iterResulArr = function (item, index, arr) {
        if (index == 0) {
          arr[index] = `
                    ${item}:`;
        } else {
          arr[index] = `
${index}) ${item}`;
        }
      };
      result.forEach(iterResulArr);

      // convert array back to string to pass value to cxt.reply
      const joinResultArr = result.join('');

      return ctx.reply(joinResultArr + '');

      // anything else that has caption
    } else if (ctx.message.caption) {
      const result = await getTranslation(ctx.message.caption, ctx.session.from, ctx.session.to);
      return ctx.reply(result + '');

      // rest of result without text or caption fields
    } else {
      return ctx.reply('Wrong format. This type of message cannot be translated'); // + '' = force to 'string' otherwise json error
    }
  } catch (e) {
    if (e.code === 3) {
      console.log(e);
      return ctx.reply(e.details + ' Change source or target language and try again. Type /check to check the current language bracket');
    }
    console.log(e);
    return ctx.reply('Error');
  }
};