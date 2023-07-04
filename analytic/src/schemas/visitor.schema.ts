import * as mongoose from 'mongoose';
import { IVisitor } from '../interfaces/visitor/visitor.interface';

function transformValue(doc, ret: { [key: string]: any }) {
    delete ret._id;
}

export const VisitorSchema = new mongoose.Schema(
    {
        visitorId: {
            type: String,
            required: [true, 'VisitorMessage can not be empty'],
        },
        ipAddress: {
            type: String,
            required: [true, 'IP Adress can not be empty'],
        },
        userAgent: {
            type: String,
            required: [true, 'UserAgent can not be empty'],
        },
        browserInfo: {
            type: String,
        },
        deviceInfo: {
            type: String,
        },
        performanceInfo: {
            type: String,
        },
        locationInfo: {
            type: String,
        },

    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        toObject: {
            virtuals: true,
            versionKey: false,
            transform: transformValue,
        },
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: transformValue,
        },
    },
);

