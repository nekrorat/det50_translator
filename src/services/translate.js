// Imports the Google Cloud client library
const {
  Translate
} = require('@google-cloud/translate').v2;

//* TEST OR PROD
const isGoogleCloudEnv = !!process.env.NODE_ENV
let translate;
if (isGoogleCloudEnv) {
  //* PROD

  // Creates a client
  translate = new Translate({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEY_FILENAME
  });

} else {
  //* LOCAL

  require('dotenv').config();
  const GOOGLE_AUTH = JSON.parse(process.env.GOOGLE_AUTH);

  // Creates a client
  translate = new Translate({
    credentials: GOOGLE_AUTH,
    projectId: GOOGLE_AUTH.project_id
  });
}

//translation service - basic
const getTranslation = async (text, from, to) => {
  const request = {
    from: from,
    to: to,
  };

  let [response] = await translate.translate(text, request);
  return response;
};

// get the list of supported languages - basic
const getSupportedLanguages = async () => {
  const [response] = await translate.getLanguages();
  return response;
};

module.exports = {
  getTranslation,
  getSupportedLanguages,
};


// Google Translate ADVANCED
// // Imports the Google Cloud client library - Advanced
// const {TranslationServiceClient} = require('@google-cloud/translate');

// const location = 'global';

// 2/3 uncommit when go on PROD
// const projectId = process.env.PROJECT_ID;


// const translationClient = new TranslationServiceClient(
//     // 3/3 commit when go on PROD
//     {
//       credentials: GOOGLE_AUTH,
//       projectId: GOOGLE_AUTH.project_id,
//     },
// );

// // translation service - advanced
// const getTranslationAdv = async (text, from, to) => {
//   const request = {
//     parent: `projects/${projectId}/locations/${location}`,
//     contents: [text],
//     mimeType: 'text/plain', // mime types: text/plain, text/html
//     sourceLanguageCode: from,
//     targetLanguageCode: to,
//   };

//   const [response] = await translationClient.translateText(request);
//   return response;
// };


// // get the list of supported languages - advanced
// const getSupportedLanguagesAdv = async () => {
//   // Construct request
//   const request = {
//     parent: `projects/${projectId}/locations/${location}`,
//     displayLanguageCode: 'en',
//   };

//   const [response] = await translationClient.getSupportedLanguages(request);
//   //console.log('getSupportedLang: ', response);
//   return response;
// };