import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';

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
    async editStore(@Body() body: CreateStoreDto, @User('userId') userId: number) {
        return this.storeService.createStore(body, userId);
    }

    @Get('/categories')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    async getStoreCategories() {
        return this.storeService.getStoreCategories();
    }
}
