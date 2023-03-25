module.exports = () => {
  const message = `
LIST OF COMMANDS:
/start  - main menu
/pic    - translate text from picture
/to     - set the target language
/from   - set the source language
/check  - check the current language bracket
/help   - get help
/cancel - abort current operation
----------
/to - TARGET LANGUAGE INSTRUCTIONS:
1.1 Please text /to to change a target language.
1.2 You can set up target language by texting a country flag emoji [🇬🇧, 🇺🇦, 🇷🇺, etc.] or language name [German, French, Spanish, etc].
1.3 Auto-detection for /to language is not allowed.

/from - SOURCE LANGUAGE INSTRUCTIONS:
2.1 Please text /from to change a source language.
2.2 You can set up source language by texting a country flag emoji [🇬🇧, 🇺🇦, 🇷🇺, etc.] or language name [German, French, Spanish, etc] or auto to go back to the auto-detection. 

Note: Do not use subdivision flags such as 🏴󠁧󠁢󠁥󠁮󠁧󠁿, they are not allowed.
`;
  return message;
};
