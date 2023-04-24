import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@ApiTags('stores')
@Controller('stores')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class StoreController {
    constructor(private storeService: StoreService) { }

    @Get()
    getStores(@User('userId') userId: number) {
        return this.storeService.getStores(userId);
    }

    @Get('/:id')
    getStore(@Param('id') id: number) {
        return this.storeService.getStore(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    editStore(@Body() body: CreateStoreDto, @User('userId') userId: number) {
        return this.storeService.createStore(body, userId);
    }

    @Get('/categories')
    getStoreCategories() {
        return this.storeService.getStoreCategories();
    }

    @Put("/:id")
    updateStore(@Param("id") id: string, @Body() body: UpdateStoreDto) {
        return this.storeService.updateStore(+id, body);
    }


    @Delete("/:id")
    deleteStore(@Param("id") id: string) {
        return this.storeService.deleteStore(+id);
    }
}
