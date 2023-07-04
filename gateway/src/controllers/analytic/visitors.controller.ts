import {
  Controller,
  Inject,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';

import { Authorization } from '../../decorators/authorization.decorator';

import { IAuthorizedRequest } from '../../interfaces/common/authorized-request.interface';
import { IServiceVisitorCreateResponse } from '../../interfaces/analytic/visitor/service-analytic-visitor-create-response.interface';
import { IServiceVisitorDeleteResponse } from '../../interfaces/analytic/visitor/service-analytic-visitor-delete-response.interface';
import { IServiceVisitorSearchByUserIdResponse } from '../../interfaces/analytic/visitor/service-analytic-visitor-search-by-user-id-response.interface';
import { IServiceVisitorUpdateByIdResponse } from '../../interfaces/analytic/visitor/service-analytic-visitor-update-by-id-response.interface';
import { GetVisitorsResponseDto } from '../../interfaces/analytic/visitor/dto/get-visitors-response.dto';
import { CreateVisitorResponseDto } from '../../interfaces/analytic/visitor/dto/create-visitor-response.dto';
import { DeleteVisitorResponseDto } from '../../interfaces/analytic/visitor/dto/delete-visitor-response.dto';
import { UpdateVisitorResponseDto } from '../../interfaces/analytic/visitor/dto/update-visitor-response.dto';
import { CreateVisitorDto } from '../../interfaces/analytic/visitor/dto/create-visitor.dto';
import { UpdateVisitorDto } from '../../interfaces/analytic/visitor/dto/update-visitor.dto';
import { VisitorIdDto } from '../../interfaces/analytic/visitor/dto/visitor-id.dto';
import { IIDVisitor } from '../../interfaces/analytic/visitor/visitor-id.interface';

@Controller('visitors')
@ApiTags('visitors')
export class AnalyticVisitorsController {
  constructor(
    @Inject('ANALYTIC_SERVICE') private readonly analyticServiceClient: ClientProxy,
  ) { }

  @Get()
  @Authorization(true)
  @ApiOkResponse({
    type: GetVisitorsResponseDto,
    description: 'List of visitors for a visitor',
  })
  public async getVisitors(
    @Req() request: IAuthorizedRequest,
    @Body() visitorIDRequest: IIDVisitor,
  ): Promise<GetVisitorsResponseDto> {
    const userInfo = request.user;

    const visitorsResponse: IServiceVisitorSearchByUserIdResponse =
      await firstValueFrom(
        this.analyticServiceClient.send('visitor_search_by_visitor_id', visitorIDRequest),
      );

    return {
      message: visitorsResponse.message,
      data: {
        visitors: visitorsResponse.visitors,
      },
      errors: null,
    };
  }

  @Post()
  @ApiCreatedResponse({
    type: CreateVisitorResponseDto,
  })
  public async createVisitor(
    @Req() request: IAuthorizedRequest,
    @Body() visitorRequest: CreateVisitorDto,
  ): Promise<CreateVisitorResponseDto> {
    const userInfo = request.user;
    const createVisitorResponse: IServiceVisitorCreateResponse = await firstValueFrom(
      this.analyticServiceClient.send(
        'visitor_create',
        visitorRequest,
      ),
    );

    if (createVisitorResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createVisitorResponse.message,
          data: null,
          errors: createVisitorResponse.errors,
        },
        createVisitorResponse.status,
      );
    }

    return {
      message: createVisitorResponse.message,
      data: {
        visitor: createVisitorResponse.visitor,
      },
      errors: null,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Authorization(true)
  @ApiOkResponse({
    type: DeleteVisitorResponseDto,
  })
  public async deleteVisitor(
    @Req() request: IAuthorizedRequest,
    @Param() params: VisitorIdDto,
  ): Promise<DeleteVisitorResponseDto> {
    const userInfo = request.user;

    const deleteVisitorResponse: IServiceVisitorDeleteResponse = await firstValueFrom(
      this.analyticServiceClient.send('visitor_delete_by_id', {
        id: params.id,
        userId: userInfo.id,
      }),
    );

    if (deleteVisitorResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: deleteVisitorResponse.message,
          errors: deleteVisitorResponse.errors,
          data: null,
        },
        deleteVisitorResponse.status,
      );
    }

    return {
      message: deleteVisitorResponse.message,
      data: null,
      errors: null,
    };
  }

  @Put(':id')
  @ApiBearerAuth()
  @Authorization(true)
  @ApiOkResponse({
    type: UpdateVisitorResponseDto,
  })
  public async updateVisitor(
    @Req() request: IAuthorizedRequest,
    @Param() params: VisitorIdDto,
    @Body() visitorRequest: UpdateVisitorDto,
  ): Promise<UpdateVisitorResponseDto> {
    const userInfo = request.user;
    const updateVisitorResponse: IServiceVisitorUpdateByIdResponse =
      await firstValueFrom(
        this.analyticServiceClient.send('visitor_update_by_id', {
          id: params.id,
          userId: userInfo.id,
          visitor: visitorRequest,
        }),
      );

    if (updateVisitorResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateVisitorResponse.message,
          errors: updateVisitorResponse.errors,
          data: null,
        },
        updateVisitorResponse.status,
      );
    }

    return {
      message: updateVisitorResponse.message,
      data: {
        visitor: updateVisitorResponse.visitor,
      },
      errors: null,
    };
  }
}
