// telegraf
const {
    Telegraf,
    Scenes: {
        BaseScene
    }
} = require('telegraf');

// files +++++
// services
const {
    getTranslation
} = require('../services/translate');
const {
    picToText
} = require('../services/vision');
const { createFile, uploadblob, deleteFile } = require('../services/storage');

// commands
const cancelCommand = require('../commands/cancel');
const checkCommand = require('../commands/check');
const {
    backOrStayMenuButton
} = require('../js/buttons');
// files -----

const bot = new Telegraf(process.env.BOT_TOKEN)
const pic = new BaseScene('pic');

//& EXEC
pic.enter(async (ctx) => {
    try {
        const {
            fromLang,
            toLang
        } = await checkCommand(ctx);
        if (fromLang == "Auto-detection") {
            return ctx.replyWithMarkdown(`Please upload a picture now.\n\nCurrent settings: *FROM: ${fromLang} -> TO: ${toLang}*.\n\n*NOTE*: For better results, specify the (*FROM*) language of the text in the picture rather than use *Auto-Detection*.\nText /cancel to abort the current operation and change the language.`);
        }
        return ctx.replyWithMarkdown(`Please upload a picture now.\n\nCurrent settings: *FROM: ${fromLang} -> TO: ${toLang}*.\nText /cancel to abort the current operation and change the language.`);
    } catch (error) {
        console.log(error);
    }
});

pic.command('cancel', (ctx) => {
    cancelCommand(ctx);
});

pic.on('photo', async (ctx) => {
    try {
        // get a link for pic in telegram
        const image = await bot.telegram.getFileLink({
            file_id: ctx.message.photo[ctx.message.photo.length - 1].file_id
        });
        const url = image.href;
        // get the best quality photo
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_unique_id;
        // get extension of the file (jpg, png, etc.)
        const fileExt = url.substr(url.length - 3);

        // create a file in cloud storage
        const file = createFile(fileId, fileExt);

        // upload, detect text and translate 
        ctx.replyWithChatAction('upload_photo')
            .then(() => uploadblob(url, file, async () => {

                // get pic from cloud storage
                const uri = `gs://${file.bucket.name}/${file.name}`;

                // conduct OCR
                let picToTextresult = await picToText(ctx, uri)

                // translate
                const response = await getTranslation(picToTextresult, ctx.session.from || '', ctx.session.to || 'en');
                await ctx.reply(response);
                deleteFile(file.name).catch(console.error);
                return ctx.reply('Do you want to translate another picture?', backOrStayMenuButton());
            }))
        return ctx.scene.leave();
    } catch (error) {
        console.log(error);
        return ctx.reply('Error');
    }
});
pic.leave((ctx) => {
    //ctx.reply('Done');
});

pic.on('message', (ctx) => ctx.reply('Only pictures are allowed. Send a picture or text /cancel to abort the current operation and go back to the main menu.'));

module.exports = pic;

//TODO switch request (deprecated) to axios
//const axios = require("axios");

// async function downloadFile(fileUrl, outputLocationPath) {
//   const writer = outputLocationPath.createWriteStream();

//   return axios({
//     method: 'get',
//     url: fileUrl,
//     responseType: 'stream',
//   }).then(response => {

//     //ensure that the user can call `then()` only when the file has
//     //been downloaded entirely.

//     return new Promise((resolve, reject) => {
//       response.data.pipe(writer);
//       let error = null;
//       writer.on('error', err => {
//         error = err;
//         writer.close();
//         reject(err);
//       });
//       writer.on('close', () => {
//         if (!error) {
//           console.log("true")
//           resolve(true);
//         }
//         //no need to call the reject here, as it will have been called in the
//         //'error' stream;
//       });
//     });
//   });
// }

// downloadFile(url, file)
//   .then(listFiles().catch(console.error));

// axios ------------
// axios({
//   method: "get",
//   url: url,
//   responseType: "stream"
// }).then(function (response) {
//   response.data.pipe(file.createWriteStream());
// });
// axios ------------

//console.log(picToTextresult);



//return ctx.reply('Cool!');