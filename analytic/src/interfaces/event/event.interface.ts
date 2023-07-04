import { Document } from 'mongoose';

export interface IEvent extends Document {
    _id: string;
    eventType: string;
    actionId: string;
    visitorId: string;
    eventTime: string;
    eventData: any;
  }
  