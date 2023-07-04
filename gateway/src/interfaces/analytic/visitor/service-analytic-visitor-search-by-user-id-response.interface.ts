import { IVisitor } from './visitor.interface';

export interface IServiceVisitorSearchByUserIdResponse {
  status: number;
  message: string;
  visitors: IVisitor[];
}
