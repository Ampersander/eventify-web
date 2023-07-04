import { IError } from './error.interface';

export interface IErrorUpdateByIdResponse {
  status: number;
  message: string;
  error: IError | null;
  errors: { [key: string]: any } | null;
}
