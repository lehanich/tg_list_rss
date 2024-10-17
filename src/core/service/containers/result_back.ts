
// type Data<T> = T ;
// type Err<T> = Error;
type ResultValue<T> = Result<T> | T;
type Executor<T> = () => ResultValue<T>;
type FunctorExecutor<A,R> = (arg: A) => R;
type MonadExecutor<A,R> = (arg: A) => ResultValue<R>;
type State = 'ok' | 'error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class Result<T, E = unknown> { // implements PromiseLike<T>  {
  static error<E>(error: E): Result<never, E> {
    return new Result(() => {
      throw error; 
    });
  }
  
  static ok<T>(value: ResultValue<T>): Result<T> {
    return new Result(() => value);
  }

  isError: boolean = false;
  readonly data?: T;
  // readonly unpackedValue?: T;
  readonly error?: unknown;
  readonly state: State;
  // readonly rawValue?: ResultValue<T>;

  // get data(): ResultValue<T> | T | undefined{
  //   if (this.error !== "error") {
  //     return this.unpackedValue ?? this.rawValue;
  //   }

  //   return undefined;
  // }

  constructor(exec: Executor<T>, unpack: boolean = true) {
    try {
      const result = exec();

      this.data = unpack ? result instanceof Result ? result.unwrap() : result : cast(result);
      this.state = 'ok';
    } catch (e:any) {
      this.state = 'error';
      this.error = e;
    }
  }

  unwrap() {
    if (this.state === 'error') {
      throw this.error;
    }

    return this.data!;
  }

  map<R>(exec: FunctorExecutor<T, R>): Result<R> {
    if (this.state === 'error') {
      Result.error(this.error);
    }

    return new Result(() => exec(this.data!), false);
  }

  flatMap<R>(exec: MonadExecutor<T, R>): Result<R> {
    if (this.state === 'error') {
      Result.error(this.error);
    }

    return new Result(() => exec(this.data!));
  }

  catch<R>(exec: MonadExecutor<unknown, R>): Result<T | R> {
    if (this.state === 'error') {
      return new Result(() => exec(this.error));
    }

    return Result.ok(this.data!);
  }

  status() {
    // return new Result(() => {
    return this.isError ? 'Error' : 'OK';
    // })
  }

  // then() {

  // }
}

function cast<T>(value: any): T {
  return value;
}

// function power (level: number) { // | null , power-обертка с number | null 
//   return level * 2
// }

// Optional.wrap(power)