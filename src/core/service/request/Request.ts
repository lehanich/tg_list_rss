import { DataCache } from '../cache/interface';
import { Never } from '../cache/never/never';
// import Result from './containers/result';
import {RequestConfig } from './interface';

const isPlainObject = (value: unknown) => value?.constructor === Object;

export class Request<T> { // implements PromiseLike<T>
  protected cacheType: DataCache = new Never();
  protected requestFunc?: (url: string, params: object) => Promise<T>;
  protected data: RequestConfig = {url: '', params: {}};

  protected static handleError: (err: unknown) => void;
  // static interceptorCb: any;
  static interceptors: {
    request: {
      onSuccess: any,
      onError: any
    };
    response: {
      onSuccess: any,
      onError: any
    };
  };

  constructor() {
    return this;
  }

  // static interceptorRequest(onSuccess: SuccessCb, onError: ErrorCb): Promise<unknown> {
  //   return Promise.resolve((data: any, error: any) => {
  //     if (error) {
  //       return onError(error);
  //     }
  //     return onSuccess(data);
  //   })
  //   .catch((e) => {
      
  //   })
  // }

  // static interceptorResponse(onSuccess: SuccessCb, onError: ErrorCb): Promise<unknown> {
  //   return Promise.resolve((data: any, error: any) => {
  //     if (error) {
  //       return onError(error);
  //     }
  //     return onSuccess(data);
  //   })
  //   .catch((e) => {
      
  //   })
  // }

  // static setInterceptorHeaders(headers: HeadersInit) {
  //   if (!this.interceptorHeaders) {
  //     this.interceptorHeaders = {};
  //   }
  //   this.interceptorHeaders = {
  //     ...this.interceptorHeaders,
  //     ...headers
  //   };
  // }

  // interceptor(cb: Interceptor):  Request<T> {
  //   Request.setInterceptorHeaders(cb().headers);
  //   Request.handleError = cb().cb;

  //   return this;
  // }


  using(exec: (url: string, params: any)=> Promise<T>) : Request<T> {
    this.requestFunc = exec;
    return this;
  }

  cache(cache: DataCache): Request<T> {
    this.cacheType = cache;

    return this;
  }

  url(url: string) : Request<T> {
    this.data.url = url;

    return this;
  }

  queryParams(params: any): Request<T> {
    const searchParams = new URLSearchParams(params); // encodeURIComponent(base64Data);
    if (this.data.params.method === 'GET') {
      this.data.url += `?${searchParams}`;
    } else {
      this.data.params['Content-Type'] = 'application/x-www-form-urlencoded';
      this.data.params.body = searchParams;
    }

    return this;
  }

  get get() : Request<T> {
    this.data.params.method = 'GET';

    return this;
  }

  get post() : Request<T> {
    this.data.params.method = 'POST';

    return this;
  }

  get put() : Request<T> {
    this.data.params.method = 'PUT';

    return this;
  }

  get delete() : Request<T> {
    this.data.params.method = 'DELETE';

    return this;
  }

  get json() : Request<T> {
    this.data.params.responseType = 'json';

    if (this.data.params?.body) {
      // If we have passed a body property and it is a plain object or array
      if (Array.isArray(this.data.params.body) || isPlainObject(this.data.params.body)) {
        // Create a new options object serializing the body and ensuring we
        // have a content-type header
        this.data.params = {
          ...this.data.params,
          body: JSON.stringify(this.data.params.body),
          headers: {
            'Content-Type': 'application/json',
            ...this.data.params.headers,
          },
        };
      }
    }
    return this;
  }

  get text() : Request<T> {
    this.data.params.responseType = 'text';
    return this;
  }

  get xml() : Request<T> {
    // if(typeof(body) == 'string') httpRequest.setRequestHeader('Content-Type','text/xml; charset=utf-8');
    return this;
  }

  timeout(timeout: number) : Request<T> {
    // const HTTP_TIMEOUT = 3000;
    // const URL = '/test;

    // (async () => {
    //   const controller = new AbortController();
    //   const timeoutId = setTimeout(() => controller.abort(), HTTP_TIMEOUT);

    //   try {
    //     const response = await fetch(URL, {
    //       signal: controller.signal
    //     }).then((res) => res.json());
    //     console.log(response);
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     clearTimeout(timeoutId);
    //   }
    // })();
    this.data.params.timeout = timeout;
    return this;
  }

  body(body: any) : Request<T> {
    this.data.params.body = body;

    return this;
  }

  config(config: any) : Request<T> {
    this.data = config;

    return this;
  }

  private beforeCreate() {
    if (this.data.params.method === 'GET') {
      const data = this.cacheType.read(this.data.url);

      if (data) {
        return Promise.resolve(data);
      }
    }

    // if (Request.interceptorCb) {
    //   this.data.params = Request.interceptorCb(this.data.params);
    // }
    try {
      if (Request.interceptors?.request?.onSuccess) {
        this.data.params = Request.interceptors?.request?.onSuccess(this.data.params);
      }
    } catch(err) {
      if (Request.interceptors?.request?.onError) {
        console.error(Request.interceptors?.request?.onError(this.data.params));
      } else {
        console.error(err);
      }
    }

    console.log('Final params', this.data.params);
  }

  create() : Promise<any> {
    this.beforeCreate();

    return this.requestFunc!(this.data.url, this.data.params)
      .then((result: any) => { //new Promise((resolve) => 
        this.cacheType.set(this.data.url, result);
        return result;
      }).catch((err) => {
        // console.log(Request.interceptors?.response?.onError);
        if (Request.interceptors?.response?.onError) {
          err.response.config = this.data;

          return Promise.resolve()
            .then(() => Request.interceptors?.response?.onError(err.response));
        }

        err.config = this.data;

        if (Request.handleError) {
          console.log('catch handleError', err);
          Request.handleError(err.response);
          return ;
        }
        
        // throw err;
        console.error('Unhandled Error', err);
      });
  }

  createSymple() : Promise<any> {
    this.beforeCreate();

    return this.requestFunc!(this.data.url, this.data.params)
      .then((result: any) => {
        this.cacheType.set(this.data.url, result);

        return result;
      }).catch((err) => {
      
        throw err;
      });
  }
  // then(onFulfilled: any, onRejected: any): PromiseLike<any> {
  //   return new Promise((resolve, reject) => {
  //     resolve(1);
  //   })
  // }
}

// type getters = {
//   method: 'GET' | 'POST' | 'HEAD' | 'PUT';
//   body: any | null | undefined,
//   responseType: 'text' | 'json' | 'formData' | 'blob' | 'arrayBuffer',
// }


// const returnedTarget = Object.assign(Request.prototype, Mixin);