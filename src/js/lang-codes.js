const {getSupportedLanguages} = require('../services/translate');

const getLangNames = async (ctxMessage) => {
  // Compare language name with google api and return language code
  try {
    const langCodes = await getSupportedLanguages();

    let result = '';
    for (const i in langCodes) {
      if (langCodes[i].name.toLowerCase() == ctxMessage) {
        result = langCodes[i].code;
      }
    }
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};

const getLangCodes = async (ctxMessage) => {
  // Compare language code with google api and return language code and language name
  try {
    const langCodes = await getSupportedLanguages();

    let result = {};
    for (const i in langCodes) {
      if (langCodes[i].code == ctxMessage) {
        result = {
          langCode: langCodes[i].code,
          langName: langCodes[i].name,
        };
      }
    }
    return result;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getLangNames,
  getLangCodes,
};
