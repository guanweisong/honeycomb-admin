export default interface BaseRequest<T> {
  status: number;
  data: T;
}
