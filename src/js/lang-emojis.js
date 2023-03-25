const {countries} = require('countries-list');

module.exports = async (ctxMessage) => {
  // Add a function to input a country flag to set the language.
  try {
    let result = '';

    // Fix -> Check for Spanish flag emoji on PC- for some reason Spain emoji there is '🇪🇦'
    if (ctxMessage == '🇪🇦') {
      ctxMessage = '🇪🇸';
    }

    for (const i in countries) {
      if (countries[i].emoji == ctxMessage) {
        result = countries[i].languages[0];
      }
    }
    return result;
  } catch (e) {
    console.log(e);
  }
};
