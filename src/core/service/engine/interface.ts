type T = any;
type R = any;

export interface RequestAdapter {
  post(data: T): Promise<R>;
  get(data: T): Promise<R>;
}