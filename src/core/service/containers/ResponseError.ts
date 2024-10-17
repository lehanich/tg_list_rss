export default class ResponseError extends Error {
  response: Response
  config?: {url: string, params: any}; //RequestConfig

  constructor(message: string, res: Response) {
    super(message)
    this.response = res
  }
}