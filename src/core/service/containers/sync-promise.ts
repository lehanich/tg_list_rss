
export default class SyncPromise<T> {
  // нужно сделать loading чтоб resolved второй раз не вызвался

  #status: "pending" | "fullfiled" | "rejected";
  #value: any;
  protected resolved: boolean = false;
  protected onFullFilled: Function[] = [];
  protected onRejected: Function[] = [];

  constructor(fn: (resolve: Function, reject: Function) => void) {
    let that = this;
    const
      {onFullFilled, onRejected} = this;
    this.#status = "pending";

    let resolve = (value: any) => {
      if (that.#status !== "pending"  || that.resolved ) {
        return;
      }

      that.resolved = true;

      if(value != null && typeof value.then === "function") {
        value.then((data: any) => {
          this.#status = "fullfiled";
          this. #value = value;
          onFullFilled.forEach((cb) => cb(data));
        },
        (e: any) => {
          this.#status = "rejected";
          onRejected.forEach((cb) => cb(e));
        })
      } else {
        this.#status = "fullfiled";
        this. #value = value;
        onFullFilled.forEach((cb) => cb(value));
      }
    }

    let reject = (e: Error | unknown) => {
      if (that.#status !== "pending" || that.resolved) {
        return;
      }

      this.#status = "rejected";
      onRejected.forEach((cb) => cb(e));
    }

    try {
      fn(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled?: any | undefined | null, onRejected?: any | undefined | null) {
    return new SyncPromise((resolve, reject) => {
      
      this.onFullFilled.push((data: any) => resolve(onFulfilled?.data ?? data));
      this.onRejected.push((error: any) => reject(onRejected?.error ?? error));

      // const fnFullFilled = (value: any) => { 
      //   try {
      //     resolve(onFulfilled ? onFulfilled(value) : value )
      //   } catch (e) {
      //     reject(e);
      //   }
      // }

      // const fnRejected = (e: any) => { 
      //   try {
      //     reject(onRejected ? onRejected(e) : e )
      //   } catch (e) {
      //     reject(e);
      //   }
      // }

      // if (this.#status === "fullfiled") {
      //   fnFullFilled(this.#value);
      //   return;
      // }

      // if (this.#status === "rejected") {
      //   fnRejected(this.#value);
      //   return;
      // }

    });
  }

  catch(cb: (e: Error) => Function) {
    return new SyncPromise((resolve, reject) => {

    });
  }

  static resolve<T>(value: T): SyncPromise<T> {
    return new SyncPromise<T>((resolve) => resolve(value));
  }

  static reject<T>(err: T): SyncPromise<T> {
    return new SyncPromise<T>((resolve, reject) => reject(err));
  }

  static all(iterable: []) {

  }

  static any(iterable: []) {

  }

  finaly(cb: Function) {
    return new SyncPromise((resolve, reject) => {
      const exec = (data: any) => {
        try {
          let res = cb?.()

          resolve(data)
        } catch (e) {
          reject(e)
        }
      }


      this.onFullFilled.push((data:any) => resolve(cb?.() ?? data));
      this.onRejected.push(() => reject(cb?.()));
    });
  }
}

///

// new Promise((resolve) => { // 10
//   resolve(
//     new Promise((r) => setTimeout(colback => r(10), 40))
//   )

//   resolve(34) // не должен вызваться
// })

