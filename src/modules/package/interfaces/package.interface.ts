import { IService } from "src/modules/service/interfaces/service.interface";

export interface IPackage {
    id: number;
    name: string;
    services: IService[];
    price: number;
    duration: number;
}