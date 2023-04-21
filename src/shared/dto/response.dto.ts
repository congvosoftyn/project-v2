export class ResponseDto {
    constructor(data?: any, code?: number, message?: string) {
       return {
           data: data,
           code: code || 2000,
           message: message || "Sucess",
       }
   }
   data: any;
   code: number = 2000;
   message: string = "Sucess!";
}