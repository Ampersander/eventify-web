import { IVisitor } from './visitor.interface';

export interface IVisitorSearchByUserResponse {
  status: number;
  message: string;
  visitors: IVisitor[];
}
