export interface IServiceErrorDeleteResponse {
  status: number;
  message: string;
  errors: { [key: string]: any };
}
