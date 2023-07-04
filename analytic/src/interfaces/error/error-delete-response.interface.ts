export interface IErrorDeleteResponse {
  status: number;
  message: string;
  errors: { [key: string]: any } | null;
}
