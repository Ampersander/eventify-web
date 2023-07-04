import { IVisitor } from './visitor.interface';

export interface IVisitorUpdateByIdResponse {
  status: number;
  message: string;
  visitor: IVisitor | null;
  errors: { [key: string]: any } | null;
}
