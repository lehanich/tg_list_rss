
type CookieOptionsKeys = "expires"|"path"|"secure"|"max-age";
interface CookieOptions {
  expires?: any;
  path?: string;
  secure?: boolean;
  'max-age'?: number;
}


export default function setCookie(name: string, value: string, options: CookieOptions) {

  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in Object.keys(options)) {
    updatedCookie += "; " + optionKey;
    let optionValue:any = options[<CookieOptionsKeys>optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}
