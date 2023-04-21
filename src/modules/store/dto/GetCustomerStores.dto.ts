export class GetCustomerStoresDto {
    latitude: number;
    longitude: number;
    myLatitude: number;
    myLongitude: number;
    search: string;
    hasService: string;
    zoom?: number;
    skip: number;
    take: number;
}