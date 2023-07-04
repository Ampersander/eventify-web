import { IError } from './error.interface';

export interface IErrorSearchByUserResponse {
  status: number;
  message: string;
  errors: IError[];
}
