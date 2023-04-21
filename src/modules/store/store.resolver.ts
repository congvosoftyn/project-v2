import { Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { StoreEntity } from "src/entities/Store.entity";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { User } from "../user/decorators/user.decorator";
import { StoreService } from "./store.service";
import { Response } from 'express';
import { EditStoreInput } from "./dto/EditStore.input";
import { GetCustomerStoresInput } from "./dto/GetCustomerStores.input";
import { UploadImageInput } from "./dto/UploadImage.input";
import JwtCustomerAuthGuard from "src/shared/guards/jwtCustomerAuth.guard";
import { UserCustomer } from "../user/decorators/user-customer.decorator";

@Resolver(() => StoreEntity)
export class StoreResolver {
    constructor(private storeService: StoreService) { }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => StoreEntity)
    async getStores(@User('companyId') companyId: number) {
        return this.storeService.getStores(companyId);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => StoreEntity, { name: 'select' })
    async selectStore(@Args('storeId', { type: () => Int }) storeId: number, @Args('refreshToken', { type: () => String }) refreshToken: string, @User('companyId') companyId: number, @User('roleIds') roleIds: [number], @User('userId') userId: number,) {
        return this.storeService.selectStore(storeId, refreshToken, companyId, roleIds, userId,);
    }

    // // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => StoreEntity, { name: 'get' })
    async getStore(@Args('id', { type: () => Int }) id: number, @User('storeId') storeId: number) {
        return this.storeService.getStore(id, storeId);
    }

    // // @ApiBearerAuth('access-token')
    @Mutation(() => StoreEntity)
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async editStore(@Args('editStore') editStore: EditStoreInput, @User('companyId') companyId: number) {
        return this.storeService.editStore(editStore, companyId);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => StoreEntity, { name: 'current' })
    async getStoreCurrent(@Args('id', { type: () => Int }) id: number, @User('storeId') storeId: number) {
        return this.storeService.getStore(id, storeId);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => StoreEntity, { name: 'module' })
    async getModules(@User('companyId') companyId: number) {
        return this.storeService.getModules(companyId);
    }

    // // @ApiBearerAuth('access-token')
    @Query(() => StoreEntity, { name: 'subDomain' })
    @UseGuards(JwtAuthenticationGuard)
    async checkAvailability(@Args('subDomain', { type: () => String }) subDomain: string) {
        return this.storeService.checkAvailability(subDomain);
    }

    @Query(() => StoreEntity, { name: 'client' })
    async getcustomerStores(@Args('customerStore') customerStore: GetCustomerStoresInput) {
        return this.storeService.getcustomerStores(customerStore);
    }

    // // @Get('/client/:id')
    @Query(() => StoreEntity, { name: 'client' })
    async getCustomerStoreDetail(@Args('id', { type: () => Int }) id: number) {
        return this.storeService.getCustomerStoreDetail(id);
    }

    @Mutation(() => StoreEntity, { name: 'client' })
    @UseGuards(JwtCustomerAuthGuard)
    @UsePipes(new ValidationPipe())
    async uploadImage(@Args('uploadImage') uploadImage: UploadImageInput, @UserCustomer('customerId') customerId: number, @Args('id', { type: () => Int }) id: number) {
        return this.storeService.uploadImage(uploadImage, customerId, id);
    }

    @Query(() => StoreEntity, { name: 'wallet_client' })
    @UseGuards(JwtCustomerAuthGuard)
    async getWallet(@UserCustomer('customerId', { type: () => Int }) customerId: number, @Args('skip', { type: () => Int }) skip: number, @Args('take', { type: () => Int }) take: number,): Promise<StoreEntity[]> {
        return this.storeService.getWallet(customerId, skip, take);
    }

    // @Get('/wallet/client/:id')
    @Query(() => StoreEntity, { name: 'wallet_client_id' })
    @UseGuards(JwtCustomerAuthGuard)
    async getWalletDetail(@Args('id', { type: () => Int }) id: number) {
        return this.storeService.getWalletDetail(id);
    }

    @Query(() => StoreEntity, { name: 'checkin' })
    @UseGuards(JwtCustomerAuthGuard)
    async checkin(@User('customerId', { type: () => Int }) customerId: number) {
        return this.storeService.getCheckin(customerId);
    }

    @Query(() => StoreEntity, { name: 'review' })
    @UseGuards(JwtCustomerAuthGuard)
    async getReview(@Args('id', { type: () => Int }) id: number, @Args('skip', { type: () => Int }) skip: number, @Args('take', { type: () => Int }) take: number,) {
        return this.storeService.getReview(skip, take, id);
    }

    @Query(() => StoreEntity, { name: 'review_rating' })
    @UseGuards(JwtCustomerAuthGuard)
    async getRating(@Args('id', { type: () => Int }) id: number) {
        return this.storeService.getRating(id);
    }

    @Query(() => StoreEntity, { name: 'categories' })
    @UseGuards(JwtCustomerAuthGuard)
    async getStoreCategories() {
        return this.storeService.getStoreCategories();
    }
}