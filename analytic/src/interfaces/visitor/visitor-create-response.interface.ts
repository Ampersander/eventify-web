import { IVisitor } from './visitor.interface';

export interface IVisitorCreateResponse {
  status: number;
  message: string;
  visitor: IVisitor | null;
  errors: { [key: string]: any } | null;
}
