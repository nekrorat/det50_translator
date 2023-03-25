const {getLangCodes} = require('../js/lang-codes');

let result = {};

result = async ({session: {from, to}}) => {
  try {
    // retrieve language names based on language codes from session
    const fromLangCodes = await getLangCodes(from);
    const toLangCodes = await getLangCodes(to);

    const langBracket = {
      fromLang: fromLangCodes.langName || 'Auto-detection',
      toLang: toLangCodes.langName || 'English',
    };

    return langBracket;
  } catch (error) {
    console.log(error);
  }
};

module.exports = result;
