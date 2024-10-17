// import fetch from "node-fetch";
import ResponseError from "../containers/ResponseError"

type Params = {
  method: 'GET' | 'POST' | 'HEAD' | 'PUT';
  body?: any,
  responseType?: 'text' | 'json' | 'formData' | 'blob' | 'arrayBuffer',
  headers?: HeadersInit
}

export function fetchEngine(url: string, params: Params): Promise<void> {
  if (params.responseType === 'json') {
    delete params.responseType;
    params.headers = {
      ...params.headers,
      "Content-Type": "application/json; charset=utf-8"
    }
  }
  
  let initOptions = params
  // If we specified a RequestInit for fetch
  // if (initOptions?.body) {
  //   // If we have passed a body property and it is a plain object or array
  //   if (Array.isArray(initOptions.body) || isPlainObject(initOptions.body)) {
  //     // Create a new options object serializing the body and ensuring we
  //     // have a content-type header
  //     initOptions = {
  //       ...initOptions,
  //       body: JSON.stringify(initOptions.body),
  //       headers: {
  //         "Content-Type": "application/json",
  //         ...initOptions.headers,
  //       },
  //     }
  //   }
  // }
  // console.log("333", initOptions)
  return new Promise((resolve: (res: any) => void, reject: (err: Error) => void) => {
    if (params.method === 'GET' || params.method === 'HEAD' || !params.method) {
      delete params.body;
    }
    console.log(params);

    fetch(url, initOptions)
      .then((response: any) => {
        if (!response.ok) {
          throw new ResponseError("Bad response", response)
        }
        // resolve(response);
        return response;
      })
      .then((res)=> {
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
          resolve(res.json())
          // return response.json().then(data => {
          //   // The response was a JSON object
          //   // Process your data as a JavaScript object
          // });
        } else {
          resolve(res);
          // res.json()
          //   .then((d: any) => resolve(d))
          //   .catch((e: any) => {
          //     console.error(e);
          //     res.text().then((text: string) => {
          //       console.log("test!!! ", text)
          //       resolve({response: text})
          //     })
          //   });
          // res.text().then((text: string) => {
          //   console.log("test!!! ", text)
          //   resolve({response: text})
          // })
        }
      })
      .catch((e:any) => reject(new ResponseError("Bad response", e)));

    // const res = await fetch(input, initOptions)
    // console.log("myFetch result")
    // console.dir(res)
    // if (!res.ok) {
    //   throw new ResponseError("Bad response", res)
    // }
    // return res
  });
}
