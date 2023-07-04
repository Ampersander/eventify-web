import { IError } from './error.interface';

export interface IServiceErrorSearchByUserIdResponse {
  status: number;
  message: string;
  errors: IError[];
}
