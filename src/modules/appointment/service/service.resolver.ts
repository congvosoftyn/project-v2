import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ProductEntity } from 'src/entities/Product.entity';
import { ProductCategoryEntity } from 'src/entities/Category.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { GetServiceInput } from './dto/get-service.input';
import { SaveServiceInput } from './dto/save-service.input';
import { ServiceService } from './service.service';
const pubSub = new PubSub();
const NEW_SERVICE_EVENT = 'newService';
import * as jwt from 'jsonwebtoken';
import { LIFE_SECRET } from 'src/config';
import { DataStoredInToken } from 'src/shared/interfaces/DataStoreInToken.interface';

@Resolver(() => ProductEntity)
@UseGuards(JwtAuthenticationGuard)
export class ServiceResolver {
  constructor(private readonly serviceService: ServiceService) { }

  @Query(() => [ProductEntity])
  async getServices(@User('storeId') storeId: number, @Args('getServiceInput') { search, size, page }: GetServiceInput) {
    return this.serviceService.getServices(storeId, search, size, page);
  }

  @Query(() => [ProductCategoryEntity], { name: 'cats' })
  async getCategories(@User('storeId') storeId: number) {
    return this.serviceService.getCategories(storeId);
  }

  @Mutation(() => ProductEntity)
  @UsePipes(new ValidationPipe())
  async saveService(@Args('saveServiceInput') saveServiceInput: SaveServiceInput, @User('storeId') storeId: number,) {
    const service = await this.serviceService.saveService(saveServiceInput as ProductEntity, storeId);
    pubSub.publish(NEW_SERVICE_EVENT, { newService: service })
    return service
  }

  @Subscription(() => ProductEntity, {
    name: 'newService',
    filter: async (payload, variables, context) => {
      const service: ProductEntity = payload.newService;
      const token = context.req.headers.authorization.split(' ')[1];
      try {
        const decode = jwt.verify(token, `${LIFE_SECRET}`) as DataStoredInToken;
        if (service.storeId = decode.storeId) return true
      } catch (error) {
        return false
      }
      return false;
    }
  })
  newService() {
    return pubSub.asyncIterator(NEW_SERVICE_EVENT);
  }
}
