import { IError } from './error.interface';

export interface IServiceErrorCreateResponse {
  status: number;
  message: string;
  error: IError | null;
  errors: { [key: string]: any };
}
