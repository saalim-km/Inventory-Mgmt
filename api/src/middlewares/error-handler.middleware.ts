// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_MESSAGES, HTTP_STATUS } from 'src/utils/constants';

@Catch() // Catch all exceptions
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Handle validation errors from class-validator
    if (exception instanceof BadRequestException) {
      const res = exception.getResponse();
      Logger.warn('Validation error');
      return response.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'Validation failed',
        errors:
          typeof res === 'object' && res !== null && 'message' in res
            ? (res as any).message
            : res,
      });
    }

    // Handle NestJS HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message || ERROR_MESSAGES.SERVER_ERROR;

      Logger.warn(message);
      return response.status(status).json({
        success: false,
        statusCode: status,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle unknown/unexpected errors
    const statusCode =
      (exception as any)?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      (exception as any)?.message || ERROR_MESSAGES.SERVER_ERROR;

    Logger.error(message, exception);
    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
