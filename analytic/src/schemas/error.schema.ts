import * as mongoose from 'mongoose';
import { IError } from '../interfaces/error/error.interface';

function transformValue(doc, ret: { [key: string]: any }) {
    delete ret._id;
}

export const ErrorSchema = new mongoose.Schema(
    {
        errorMessage: {
            type: String,
            required: [true, 'ErrorMessage can not be empty'],
        },
        source: {
            type: String,
            required: [true, 'Source can not be empty'],
        },
        lineNo: {
            type: Number,
            required: [true, 'LineNo can not be empty'],
        },
        colNo: {
            type: Number,
            required: [true, 'ColNo can not be empty'],
        },
        error: {
            type: Number,
        },
        timestamp: {
            type: Number,
            required: [true, 'Timestamp can not be empty'],
        },
        visitorId: {
            type: String,
            required: [true, 'VisitorId can not be empty'],
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

