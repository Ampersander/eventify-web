import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IVisitor } from '../interfaces/visitor/visitor.interface';
import { IVisitorUpdateParams } from '../interfaces/visitor/visitor-update-params.interface';

@Injectable()
export class VisitorService {
    constructor(@InjectModel('Visitor') private readonly visitorModel: Model<IVisitor>) { }

    public async getVisitorById(visitorID: string): Promise<IVisitor[]> {
        return this.visitorModel.find({ visitorID: visitorID }).exec();
    }

    public async createVisitor(visitorBody: IVisitor): Promise<IVisitor> {
        const visitorModel = new this.visitorModel(visitorBody);
        return await visitorModel.save();
    }

    public async findVisitorById(id: string) {
        return await this.visitorModel.findById(id);
    }

    public async removeVisitorById(id: string) {
        return await this.visitorModel.findOneAndDelete({ _id: id });
    }

    public async updateVisitorById(id: string, params: IVisitorUpdateParams): Promise<IVisitor> {
        return (await this.visitorModel.updateOne({ _id: id }, params)) as any;
    }
}
