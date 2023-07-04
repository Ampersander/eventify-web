import { Document } from 'mongoose';

export interface IError extends Document {
    _id: string;
    message: string;
    source: string;
    lineno: number;
    colno: number;
    error: string | null;
    timestamp: string;
    visitorId: string;
  }
  