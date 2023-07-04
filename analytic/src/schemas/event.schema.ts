import * as mongoose from 'mongoose';
import { IEvent } from '../interfaces/event/event.interface';

function transformValue(doc, ret: { [key: string]: any }) {
    delete ret._id;
}

export const EventSchema = new mongoose.Schema(
    {
        eventType: {
            type: String,
            required: [true, 'EventType can not be empty'],
        },
        actionId: {
            type: String,
            required: [true, 'ActionId can not be empty'],
        },
        visitorId: {
            type: String,
            required: [true, 'VisitorId can not be empty'],
        },
        eventTime: {
            type: Number,
            required: [true, 'EventTime can not be empty'],
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

