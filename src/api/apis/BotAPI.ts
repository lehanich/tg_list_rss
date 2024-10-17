// import {UserLogin, } from '@models/Users';
import { PUBLIC_URL } from '../variables';
import { fetchEngine } from '@core/service/engine/fetchEngine';
import { Request } from '@core/service/request/Request';

export default function User() {

  function getMe<T> (): Promise<T> {
    const req = new Request();
    
    return req
      .using(fetchEngine)
      .url(`${PUBLIC_URL}/getMe`)
      .get
      .json
      .createSymple();
  }

  function getChat<T> (chatId: number | string): Promise<T> {
    const req = new Request();
    
    return req
      .using(fetchEngine)
      .url(`${PUBLIC_URL}/getChat?chat_id=${chatId}`) // @art_basement
      .post
      .json
      .createSymple();
  }

  function getUpdates<T> (chatId: number | string): Promise<T> {
    const req = new Request();
    
    return req
      .using(fetchEngine)
      .url(`${PUBLIC_URL}/getUpdates?chat_id=${chatId}`) // @art_basement
      .post
      .json
      .createSymple();
  }

  function getFile<T> (fileId: number | string): Promise<T> {
    const req = new Request();
    
    return req
      .using(fetchEngine)
      .url(`${PUBLIC_URL}/getFile?file_id=${fileId}`) // @art_basement
      .post
      .json
      .createSymple();
  }

  return Object.freeze({
    getMe,
    getChat,
    getUpdates,
    getFile
  });
}
