// type Data<T> = T ;
// type Err<T> = Error;
type ResultValue<T> = Result<T> | T;
type Executor<T> = () => T | ResultValue<T>;
type FunctorExecutor<A,R> = (arg: A) => R;
type MonadExecutor<A,R> = (arg: A) => ResultValue<R>;
// type State = "ok" | "error";

enum ResultState {
  Ok = 0,
  Error = 1
}

export default class Result<T, E = unknown> { // implements PromiseLike<T>  {
  #state!: ResultState;
  #data: T | null = null;
  #error: E | unknown;
  

  // static error<E>(error: E): Result<never, E> {
  //   return new Result(() => {
  //     throw this.error; 
  //   })
  // };
  
  // static ok<T>(value: ResultValue<T>): Result<T> {
  //   return new Result(() => value);
  // }

  // isError: Boolean = false;
  // readonly data?: T;
  // // readonly unpackedValue?: T;
  // readonly error?: unknown;
  // readonly state: State;
  // readonly rawValue?: ResultValue<T>;

  // get data(): ResultValue<T> | T | undefined{
  //   if (this.error !== "error") {
  //     return this.unpackedValue ?? this.rawValue;
  //   }

  //   return undefined;
  // }

  constructor(exec: Executor<T>, unpack: boolean = true) {
    try {
      const data = exec();

      if (unpack && data instanceof Result) {
        data
          .then((data) => {
            this.#state = ResultState.Ok;
            this.#data = data;
          })
          .catch((error: Error) => {
            this.#state = ResultState.Error;
            this.#error = error;
          });
      } else {
        this.#data = <any>data;
        this.#state = ResultState.Ok;
      }
      // this.data = unpack ? result instanceof Result ? result.unwrap() : result : cast(result);
      // this.state = "ok";
    } catch (e:any) {
      this.#state = ResultState.Error;
      this.#error = e;
    }
  }

  unwrap() {
    if (this.#state === ResultState.Error) {
      throw this.#error;
    }

    return this.#data!;
  }

  map<R>(exec: FunctorExecutor<T, R>): Result<R> {
    if (this.#state === ResultState.Ok) {
      return new Result<R>(() => exec(this.#data), false);
    }

    return <any>this;
  }

  flatMap<R>(exec: MonadExecutor<T, R>): Result<R> {
    if (this.#state === ResultState.Error) {
      return <any>this; // Result.error(this.#error)
    }

    return new Result(() => exec(this.#data!));
  }

  then<R>(exec: MonadExecutor<T, R>): Result<R> {
    if (this.#state === ResultState.Ok) {
      return new Result<R>(() => exec(this.#data));
    }

    return <any>this;
  }

  catch<R>(exec: MonadExecutor<unknown, R>): Result<T | R> {
    if (this.#state === ResultState.Error) {
      return new Result<R>(() => exec(this.#error!));
    }

    return <any>this;//Result.ok(this.data!);
  }

  status() {
    // return new Result(() => {
    return this.#state === ResultState.Error ? 'Error' : 'OK';
    // })
  }

  // then() {

  // }
}

// function cast<T>(value: any): T {
//   return value;
// }

// function power (level: number) { // | null , power-обертка с number | null 
//   return level * 2
// }

// Optional.wrap(power)