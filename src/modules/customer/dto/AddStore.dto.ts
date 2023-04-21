export class AddStoreDto {
  name: string;
  categories: string;
  priceRange: number;
  phoneNumber: string;
  email: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  latitude: number;
  longitude: number;
  secretKey: string;
  icon: string;
  image?: string;
  subDomain: string;
  website?: string;
}
