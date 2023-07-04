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
import { IServiceErrorCreateResponse } from '../../interfaces/analytic/error/service-analytic-error-create-response.interface';
import { IServiceErrorDeleteResponse } from '../../interfaces/analytic/error/service-analytic-error-delete-response.interface';
import { IServiceErrorSearchByUserIdResponse } from '../../interfaces/analytic/error/service-analytic-error-search-by-user-id-response.interface';
import { IServiceErrorUpdateByIdResponse } from '../../interfaces/analytic/error/service-analytic-error-update-by-id-response.interface';
import { GetErrorsResponseDto } from '../../interfaces/analytic/error/dto/get-errors-response.dto';
import { CreateErrorResponseDto } from '../../interfaces/analytic/error/dto/create-error-response.dto';
import { DeleteErrorResponseDto } from '../../interfaces/analytic/error/dto/delete-error-response.dto';
import { UpdateErrorResponseDto } from '../../interfaces/analytic/error/dto/update-error-response.dto';
import { CreateErrorDto } from '../../interfaces/analytic/error/dto/create-error.dto';
import { UpdateErrorDto } from '../../interfaces/analytic/error/dto/update-error.dto';
import { ErrorIdDto } from '../../interfaces/analytic/error/dto/error-id.dto';
import { IIDVisitor } from '../../interfaces/analytic/visitor/visitor-id.interface';


@Controller('errors')
@ApiTags('errors')
export class AnalyticErrorsController {
  constructor(
    @Inject('ANALYTIC_SERVICE') private readonly analyticServiceClient: ClientProxy,
  ) { }

  @Get()
  @Authorization(true)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: GetErrorsResponseDto,
    description: 'List of errors for a visitor',
  })
  public async getErrors(
    @Req() request: IAuthorizedRequest,
    @Body() visitorIDRequest: IIDVisitor,
  ): Promise<GetErrorsResponseDto> {
    const userInfo = request.user;

    const errorsResponse: IServiceErrorSearchByUserIdResponse =
      await firstValueFrom(
        this.analyticServiceClient.send('error_search_by_visitor_id', visitorIDRequest),
      );

    return {
      message: errorsResponse.message,
      data: {
        errors: errorsResponse.errors,
      },
      errors: null,
    };
  }

  @Post()
  @ApiCreatedResponse({
    type: CreateErrorResponseDto,
  })
  public async createError(
    @Req() request: IAuthorizedRequest,
    @Body() errorRequest: CreateErrorDto,
  ): Promise<CreateErrorResponseDto> {
    const userInfo = request.user;
    const createErrorResponse: IServiceErrorCreateResponse = await firstValueFrom(
      this.analyticServiceClient.send(
        'error_create',
        errorRequest
      ),
    );

    if (createErrorResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createErrorResponse.message,
          data: null,
          errors: createErrorResponse.errors,
        },
        createErrorResponse.status,
      );
    }

    return {
      message: createErrorResponse.message,
      data: {
        error: createErrorResponse.error,
      },
      errors: null,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Authorization(true)
  @ApiOkResponse({
    type: DeleteErrorResponseDto,
  })
  public async deleteError(
    @Req() request: IAuthorizedRequest,
    @Param() params: ErrorIdDto,
  ): Promise<DeleteErrorResponseDto> {
    const userInfo = request.user;

    const deleteErrorResponse: IServiceErrorDeleteResponse = await firstValueFrom(
      this.analyticServiceClient.send('error_delete_by_id', {
        id: params.id,
        userId: userInfo.id,
      }),
    );

    if (deleteErrorResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: deleteErrorResponse.message,
          errors: deleteErrorResponse.errors,
          data: null,
        },
        deleteErrorResponse.status,
      );
    }

    return {
      message: deleteErrorResponse.message,
      data: null,
      errors: null,
    };
  }

  @Put(':id')
  @ApiBearerAuth()
  @Authorization(true)
  @ApiOkResponse({
    type: UpdateErrorResponseDto,
  })
  public async updateError(
    @Req() request: IAuthorizedRequest,
    @Param() params: ErrorIdDto,
    @Body() errorRequest: UpdateErrorDto,
  ): Promise<UpdateErrorResponseDto> {
    const userInfo = request.user;
    const updateErrorResponse: IServiceErrorUpdateByIdResponse =
      await firstValueFrom(
        this.analyticServiceClient.send('error_update_by_id', {
          id: params.id,
          userId: userInfo.id,
          error: errorRequest,
        }),
      );

    if (updateErrorResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateErrorResponse.message,
          errors: updateErrorResponse.errors,
          data: null,
        },
        updateErrorResponse.status,
      );
    }

    return {
      message: updateErrorResponse.message,
      data: {
        error: updateErrorResponse.error,
      },
      errors: null,
    };
  }
}