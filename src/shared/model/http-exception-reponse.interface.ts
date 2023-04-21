export interface HttpExceptionReponse {
    statusCode: number;
    error: string;
}

export interface CustomerHttpExceptionReponse extends HttpExceptionReponse {
    path: string;
    method: string;
    timeStamp: Date;
}
