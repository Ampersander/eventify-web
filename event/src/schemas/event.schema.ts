import * as mongoose from 'mongoose';
import { IEvent } from '../interfaces/event.interface';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name can not be empty'],
    },
    description: String,
    user_id: {
      type: String,
      required: [true, 'User can not be empty'],
    },
    start_time: {
      type: Number,
      required: [true, 'Start time can not be empty'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration can not be empty'],
    },
    is_solved: {
      type: Boolean,
      required: [true, 'Solved flag can not be empty'],
    },
    notification_id: {
      type: Number,
      required: false,
      default: null,
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

EventSchema.pre('validate', function (next) {
  const self = this as IEvent;

  if (this.isModified('user_id') && self.created_at) {
    this.invalidate('user_id', 'The field value can not be updated');
  }
  next();
});
