export interface IVisitorDeleteResponse {
  status: number;
  message: string;
  errors: { [key: string]: any } | null;
}
