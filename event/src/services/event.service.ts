import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IEvent } from '../interfaces/event.interface';
import { IEventUpdateParams } from '../interfaces/event-update-params.interface';

@Injectable()
export class EventService {
  constructor(@InjectModel('Event') private readonly eventModel: Model<IEvent>) {}

  public async getEventsByUserId(userId: string): Promise<IEvent[]> {
    return this.eventModel.find({ user_id: userId }).exec();
  }

  public async createEvent(eventBody: IEvent): Promise<IEvent> {
    const eventModel = new this.eventModel(eventBody);
    return await eventModel.save();
  }

  public async findEventById(id: string) {
    return await this.eventModel.findById(id);
  }

  public async removeEventById(id: string) {
    return await this.eventModel.findOneAndDelete({ _id: id });
  }

  public async updateEventById(
    id: string,
    params: IEventUpdateParams,
  ): Promise<IEvent> {
    return (await this.eventModel.updateOne({ _id: id }, params)) as any;
  }
}
