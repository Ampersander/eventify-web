import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IError } from '../interfaces/error/error.interface';
import { IErrorUpdateParams } from '../interfaces/error/error-update-params.interface';

@Injectable()
export class ErrorService {
    constructor(@InjectModel('Error') private readonly errorModel: Model<IError>) { }

    public async getErrorsByVisitorId(visitorID: string): Promise<IError[]> {
        return this.errorModel.find({ visitorID: visitorID }).exec();
    }

    public async createError(eventBody: IError): Promise<IError> {
        const errorModel = new this.errorModel(eventBody);
        return await errorModel.save();
    }

    public async findErrorById(id: string) {
        return await this.errorModel.findById(id);
    }

    public async removeErrorById(id: string) {
        return await this.errorModel.findOneAndDelete({ _id: id });
    }

    public async updateErrorById(id: string, params: IErrorUpdateParams): Promise<IError> {
        return (await this.errorModel.updateOne({ _id: id }, params)) as any;
    }
}
