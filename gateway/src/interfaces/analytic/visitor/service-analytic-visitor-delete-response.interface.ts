export interface IServiceVisitorDeleteResponse {
  status: number;
  message: string;
  errors: { [key: string]: any };
}
