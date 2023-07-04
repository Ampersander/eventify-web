import { Document } from 'mongoose';

export interface IVisitor extends Document {
    _id: string;
    visitorId: string;
    ipAddress: string;
    userAgent: string;
    browserInfo: any;
    deviceInfo: any;
    performanceInfo: any;
    locationInfo: any;
  }