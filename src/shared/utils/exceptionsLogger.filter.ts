import { ArgumentsHost, Catch, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { IncomingWebhook } from "@slack/webhook";
import { InjectSlack } from "nestjs-slack-webhook";
import { CustomerHttpExceptionReponse, HttpExceptionReponse } from "../model/http-exception-reponse.interface";
import * as fs from 'fs'
import { Request, Response } from "express";
import { ResponseDto } from "../dto/response.dto";

@Catch()
export class ExceptionsLoggerFilter extends BaseExceptionFilter {
    constructor(@InjectSlack() private readonly slackService: IncomingWebhook) {
        super();
    }

    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: HttpStatus;
        let errorMessage: string;
        const _exception = exception;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            errorMessage = _exception.getResponse().message ? _exception.getResponse().message : (exception.getResponse() as HttpExceptionReponse).error || exception.message
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMessage = 'Critial internal server error occurred';
        }

        const errorResponse = this.getErrorReponse(status, errorMessage, request)
        const errorLog: string = this.logError(exception, errorResponse, request)
        this.WriteErrorLogToFile(errorLog)
        this.slackService.send(JSON.stringify(errorResponse))

        response.status(status).json({
            code: errorResponse.statusCode + "0",
            data: {},
            message: errorResponse.error,
            // error: (exception.getResponse() as HttpExceptionReponse).error
        })
    }


    private getErrorReponse = (status: HttpStatus, errorMessage: string, request: Request): CustomerHttpExceptionReponse => ({
        statusCode: status,
        error: errorMessage,
        path: request.url,
        method: request.method,
        timeStamp: new Date()
    })

    private logError = (exception: unknown, errorReponse: CustomerHttpExceptionReponse, request: Request): string => {
        const errorLog = `
            Reponse code: ${errorReponse.statusCode} - Method: ${request.method} - URL: ${request.url}\n\n
            ${JSON.stringify(request.user ?? 'Not signed in')} \n\n
            ${exception instanceof HttpException ? exception.stack : errorReponse.error}\n\n
        `
        return errorLog
        // return `Reponse code: ${errorReponse.statusCode} - Method: ${request.method} - URL: ${request.url} - ${errorReponse.error}\n`
    }

    private WriteErrorLogToFile = (errorLog: string): void => {
        fs.appendFile('error.log', errorLog, 'utf8', (err) => {
            if (err) throw err
        })
    }
}