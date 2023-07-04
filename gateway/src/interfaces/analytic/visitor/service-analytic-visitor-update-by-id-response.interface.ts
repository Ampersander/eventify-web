import { IVisitor } from './visitor.interface';

export interface IServiceVisitorUpdateByIdResponse {
  status: number;
  message: string;
  visitor: IVisitor | null;
  errors: { [key: string]: any };
}
