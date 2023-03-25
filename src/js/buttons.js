const {
  Markup
} = require('telegraf');

const startButton = () => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('Change FROM language', 'from'),
      Markup.button.callback('Change TO language', 'to'),
    ],
    [
      Markup.button.callback('Translate text from picture', 'pic'),
    ],
    [
      Markup.button.callback('Demo', 'demo'),
      Markup.button.callback('Help', 'help'),
    ],
  ]);
};

const demoButton = () => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('Translate from picture', 'translate_picture'),
      Markup.button.callback('Translate while chatting', 'inline_tr_demo'),
    ],
    [
      Markup.button.callback('Translate text', 'translate_demo'),
      Markup.button.callback('Translate article', 'forward_tr_demo'),
    ],
    [
       Markup.button.callback('Change language', 'change_language'),
       Markup.button.callback('Back', 'back'),
    ],
  ]);
};

const backToMainMenuButton = () => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('Back', 'back'),
    ],
  ]);
};

const changeLang = (sessionCode, bool) => {
  const arrLangsMarkup = filterLangButtons(sessionCode, bool)
  return Markup.inlineKeyboard(
    [
      arrLangsMarkup,
      [
        Markup.button.callback('Back', 'back'),
      ],
    ]
  );
};

const backOrStayMenuButton = () => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('Send another picture', 'pic'),
      Markup.button.callback('Main menu', 'back'),
    ],
  ]);
};

// determine the language option TO or FROM and map proper buttons
function filterLangButtons(sessionCode, bool) {

  let objLangs = {
    'en': 'English',
    'ru': 'Russian',
    'uk': 'Ukrainian',
    'auto': 'Auto'
  };

  let arrLangs = []

  // iterate buttons object
  for (let key in objLangs) {
    // console.log([key])
    let objMarkupButton = {
      text: objLangs[key],
      callback_data: key,
      hide: false
    }
    arrLangs.push(objMarkupButton);
  }

  // check if it is FROM = true or TO = false
  bool ? objLangs : arrLangs[arrLangs.length - 1].hide = true;

  // exlude language which is same for the opposite pair FROM -> TO
  for (let i = 0; i < arrLangs.length; i++) {
    if (arrLangs[i].callback_data == sessionCode) {
       arrLangs[i].hide = true
    }
  }
  return arrLangs
}

module.exports = {
  startButton,
  demoButton,
  backToMainMenuButton,
  changeLang,
  backOrStayMenuButton,
};