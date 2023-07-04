import { IError } from '../error/error.interface';

export interface IErrorCreateResponse {
  status: number;
  message: string;
  error: IError | null;
  errors: { [key: string]: any } | null;
}
