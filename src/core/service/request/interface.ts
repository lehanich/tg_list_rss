
// type T = any;
export type Interceptor = () => { cb: (err: unknown) => void, headers: HeadersInit }
export interface RequestConfig {
  url: string,
  params: any
}
export type SuccessCb = (data: any) => any;
export type ErrorCb = (error: Error) => Promise<Error>;
export interface Interceptors<T> {
  request: (success: SuccessCb, error: ErrorCb) => Promise<T>;
  response: () => Promise<T>;
}
