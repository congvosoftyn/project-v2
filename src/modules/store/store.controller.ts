import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UsePipes, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { UserCustomer } from '../user/decorators/user-customer.decorator';
import { User } from '../user/decorators/user.decorator';
import { EditStoreDto } from './dto/EditStore.dto';
import { GetCustomerStoresDto } from './dto/GetCustomerStores.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UploadImageDto } from './dto/UploadImage.dto';
import { StoreService } from './store.service';

@ApiTags('stores')
@Controller('stores')
export class StoreController {
    constructor(private storeService: StoreService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getStores(@User('companyId') companyId: number) {
        return this.storeService.getStores(companyId);
    }

    @Get('/select/:storeId')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async selectStore(
        @Param('storeId') storeId: number, @Query('refreshToken') refreshToken: string,
        @User('companyId') companyId: number, @User('roleIds') roleIds: [number], @User('userId') userId: number,
    ) {
        return this.storeService.selectStore(storeId, refreshToken, companyId, roleIds, userId,);
    }

    @Get('/:id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getStore(@Param('id') id: number, @User('storeId') storeId: number) {
        return this.storeService.getStore(id, storeId);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async editStore(@Body() body: EditStoreDto, @User('companyId') companyId: number,) {
        return this.storeService.editStore(body, companyId);
    }

    @Get('/current')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getStoreCurrent(@Param('id') id: number, @User('storeId') storeId: number,) {
        return this.storeService.getStore(id, storeId);
    }

    @Get('/module')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getModules(@User('companyId') companyId: number) {
        return this.storeService.getModules(companyId);
    }

    @Get('/subDomain')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async checkAvailability(@Query('subDomain') subDomain: string) {
        return this.storeService.checkAvailability(subDomain);
    }

    @Put('/:id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    updateStore(@Param('id') id: number, @Body() store: UpdateStoreDto) {
        return this.storeService.updateStore(id, store);
    }

    @Get('/client')
    async getcustomerStores(@Query() _data: GetCustomerStoresDto) {
        return this.storeService.getcustomerStores(_data);
    }

    @Get('/client/:id')
    async getCustomerStoreDetail(@Param('id') id: number) {
        return this.storeService.getCustomerStoreDetail(id);
    }

    @Post('/client/:id')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    @UsePipes(new ValidationPipe())
    async uploadImage(@Body() body: UploadImageDto, @User('customerId') customerId: number, @Param('id') id: number,) {
        return this.storeService.uploadImage(body, customerId, id);
    }

    @Get('/wallet/client')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    async getWallet(@UserCustomer('customerId') customerId: number, @Query('skip') skip: number, @Query('take') take: number,) {
        return this.storeService.getWallet(customerId, skip, take);
    }

    @Get('/wallet/client/:id')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    async getWalletDetail(@Param('id') id: number) {
        return this.storeService.getWalletDetail(id);
    }

    @Get('/checkin')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    async checkin(@User('customerId') customerId: number) {
        return this.storeService.getCheckin(customerId);
    }

    @Get('/review/:id')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    async getReview(@Param('id') id: number, @Query('skip') skip: number, @Query('take') take: number,) {
        return this.storeService.getReview(skip, take, id);
    }

    @Get('/review-rating/:id')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    async getRating(@Param('id') id: number) {
        return this.storeService.getRating(id);
    }

    @Get('/categories')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    async getStoreCategories() {
        return this.storeService.getStoreCategories();
    }
}
