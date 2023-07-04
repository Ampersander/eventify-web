import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ErrorService } from '../services/error.service';
import { IError } from '../interfaces/error/error.interface';
import { IErrorUpdateParams } from '../interfaces/error/error-update-params.interface';
import { IErrorSearchByUserResponse } from '../interfaces/error/error-search-by-user-response.interface';
import { IErrorDeleteResponse } from '../interfaces/error/error-delete-response.interface';
import { IErrorCreateResponse } from '../interfaces/error/error-create-response.interface';
import { IErrorUpdateByIdResponse } from '../interfaces/error/error-update-by-id-response.interface';

@Controller()
export class ErrorController {
  constructor(private readonly errorService: ErrorService) { }

  @MessagePattern('error_search_by_visitor_id')
  public async errorSearchByUserId(
    userId: string,
  ): Promise<IErrorSearchByUserResponse> {
    let result: IErrorSearchByUserResponse;

    if (userId) {
      const errors = await this.errorService.getErrorsByVisitorId(userId);
      result = {
        status: HttpStatus.OK,
        message: 'error_search_by_visitor_id_success',
        errors,
      };
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'error_search_by_visitor_id_bad_request',
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern('error_update_by_id')
  public async errorUpdateById(params: {
    error: IErrorUpdateParams;
    id: string;
    userId: string;
  }): Promise<IErrorUpdateByIdResponse> {
    let result: IErrorUpdateByIdResponse;
    if (params.id) {
      try {
        const error = await this.errorService.findErrorById(params.id);
        if (error) {

          const updatedError = Object.assign(error, params.error);
          await updatedError.save();
          result = {
            status: HttpStatus.OK,
            message: 'error_update_by_id_success',
            error: updatedError,
            errors: null,
          };

        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'error_update_by_id_not_found',
            error: null,
            errors: null,
          };
        }
      } catch (e: any) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'error_update_by_id_precondition_failed',
          error: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'error_update_by_id_bad_request',
        error: null,
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern('error_create')
  public async errorCreate(errorBody: IError): Promise<IErrorCreateResponse> {
    let result: IErrorCreateResponse;

    if (errorBody) {
      try {

        const error = await this.errorService.createError(errorBody);
        result = {
          status: HttpStatus.CREATED,
          message: 'error_create_success',
          error,
          errors: null,
        };
      } catch (e: any) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'error_create_precondition_failed',
          error: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'error_create_bad_request',
        error: null,
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern('error_delete_by_id')
  public async errorDeleteForUser(params: {
    userId: string;
    id: string;
  }): Promise<IErrorDeleteResponse> {
    let result: IErrorDeleteResponse;

    if (params && params.userId && params.id) {
      try {
        const error = await this.errorService.findErrorById(params.id);

        if (error) {

          await this.errorService.removeErrorById(params.id);
          result = {
            status: HttpStatus.OK,
            message: 'error_delete_by_id_success',
            errors: null,
          };

        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'error_delete_by_id_not_found',
            errors: null,
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.FORBIDDEN,
          message: 'error_delete_by_id_forbidden',
          errors: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'error_delete_by_id_bad_request',
        errors: null,
      };
    }

    return result;
  }
}
