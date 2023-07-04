export interface IErrorUpdateParams {
  message: string;
  source: string;
  lineno: number;
  colno: number;
  error: string | null;
  timestamp: string;
  visitorId: string;
}
