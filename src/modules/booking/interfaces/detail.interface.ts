import { IPackage } from "src/modules/package/interfaces/package.interface";
import { IService } from "src/modules/service/interfaces/service.interface";

export interface IDetail {
    id: number;
    startTime: string;
    endTime: string;
    bookingId: number;
    service?: IService;
    package?: IPackage; 
    price: number;
    duration: number;
    startffId: number;
}