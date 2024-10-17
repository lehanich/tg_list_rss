import Result from '../containers/result';

type Params = {
  method: 'GET' | 'POST';
  body: any | null | undefined,
  responseType: XMLHttpRequestResponseType,
}

export function xhr(url: string, params: Params): Promise<void> {
  return new Promise((resolve: (res: any) => void, reject: (err: Error) => void) => {
    const xhr = new XMLHttpRequest();

    xhr.open(params.method, url, true);
    // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    // xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
    // xhr.responseType = params.responseType;
    xhr.timeout = 25000;

    xhr.onload = function() {
      if (xhr.status >= 500) {
        reject(new Error(xhr.statusText , { cause: xhr.status }));
      }
      resolve(new Result(() => { return { code: xhr.status, data: xhr.response }; }));
    };

    xhr.onerror = function() {
      reject(new Error(xhr.response , { cause: xhr.status })); // new Result(() => { throw { code: xhr.status, data: xhr.response } })
    };

    xhr.ontimeout = (e) => {
      // console.dir(e)
      // console.dir(xhr)
      // reject("Time out");
      reject(new Error( e.type, { cause: 408 } )); // new Result(() => { throw { code: 0, data: e.type } })
    };

    if(typeof(params.body) == 'string') {
      xhr.setRequestHeader('Content-Type','text/xml; charset=utf-8');
    }

    xhr.send(params.body);
  });

  // xhr.onreadystatechange = function() { // (3)
  //   if (xhr.readyState != 4) return;
    
  //   button.innerHTML = 'Готово!';
    
  //   if (xhr.status != 200) {
  //     alert(xhr.status + ': ' + xhr.statusText);
  //   } else {
  //     alert(xhr.responseText);
  //   }
    
  // }
}
