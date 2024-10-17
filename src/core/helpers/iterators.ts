/*
  Ленивый обход результата выборки
*/
export function* generator<T>(dataArray: Iterable<T>) {
  for (const item of dataArray) {
    yield item;
  }
}
