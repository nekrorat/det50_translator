const getLangEmojis = require('../js/lang-emojis');
const {getLangNames, getLangCodes} = require('./lang-codes');

// validate /to or /from language code, emoji or name
module.exports = async (ctxMessage) => {
  try {
    const result = {
      langBool: false,
      langName: '',
      langCode: '',
      ctxMessage: ctxMessage,
    };

    // check if language set as a emoji flag
    const langEmojis = await getLangEmojis(ctxMessage);
    if (langEmojis) {
      result.ctxMessage = langEmojis;
    }

    // check if language set as a language name (English, Ukrainian, etc.)
    const langNames = await getLangNames(ctxMessage);
    if (langNames) {
      result.ctxMessage = langNames;
    }

    // check if a language is supported by api + check other conditions
    const langCode = await getLangCodes(result.ctxMessage);
    if (langCode.langCode == result.ctxMessage) {
      result.langCode = langCode.langCode;
      result.langName = langCode.langName;
      result.langBool = true;
    }

    console.log("result: ", result);
    return result;
  } catch (err) {
    console.log(err);
  }
};
