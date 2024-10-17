const PRIVATE_URL = '/api-private';
// const PUBLIC_URL = `https://api.telegram.org/${process.env.BOT_KEY}/`;
const PUBLIC_URL = `https://api.telegram.org/bot${process.env.BOT_KEY}`;
const PUBLIC_URL_FILES = `https://api.telegram.org/file/bot${process.env.BOT_KEY}/`;
// const PUBLIC_URL = '/api-public';

export {
  PRIVATE_URL,
  PUBLIC_URL,
  PUBLIC_URL_FILES
};
