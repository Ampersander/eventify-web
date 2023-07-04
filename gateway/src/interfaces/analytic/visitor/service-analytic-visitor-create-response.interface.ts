import { IVisitor } from './visitor.interface';

export interface IServiceVisitorCreateResponse {
  status: number;
  message: string;
  visitor: IVisitor | null;
  errors: { [key: string]: any };
}
