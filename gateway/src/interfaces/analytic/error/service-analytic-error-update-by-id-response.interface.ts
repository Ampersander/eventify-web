import { IError } from './error.interface';

export interface IServiceErrorUpdateByIdResponse {
  status: number;
  message: string;
  error: IError | null;
  errors: { [key: string]: any };
}
