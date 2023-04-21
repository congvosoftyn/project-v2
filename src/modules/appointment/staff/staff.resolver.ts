import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { StaffEntity } from "src/entities/Staff.entity";
import { User } from "src/modules/user/decorators/user.decorator";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { CreateStaffInput } from "./dto/create-staff.input";
import { ListImportStaff } from "./dto/import-staff.input";
import { ResultDeletInput } from "./dto/result-delete.input";
import { UpdateStaffInput } from "./dto/update-staff.input";
import { StaffService } from "./staff.service";
import { PubSub } from 'graphql-subscriptions';
import * as jwt from 'jsonwebtoken';
import { LIFE_SECRET } from "src/config";
import { DataStoredInToken } from "src/shared/interfaces/DataStoreInToken.interface";
import { QueryBookingByStaffInput } from "./dto/query-booking-staff.input";
import { Any } from "typeorm";
import GraphQLJSON from "graphql-type-json";
const pubSub = new PubSub();
const STAFF_UPDATATE_EVENT = 'staffUpdate';

@Resolver(() => StaffEntity)
@UseGuards(JwtAuthenticationGuard)
export class StaffResolver {
    constructor(private readonly staffService: StaffService) { }

    @Query(() => [StaffEntity])
    async getStaffs(@User('storeId') storeId: number) {
        return this.staffService.getStaffs(storeId);
    }

    @Mutation(() => StaffEntity)
    @UsePipes(new ValidationPipe())
    async createStaff(@Args('createStaff') createStaff: CreateStaffInput, @User('storeId') storeId: number) {
        return this.staffService.createStaff(createStaff as StaffEntity, storeId);
    }

    @Mutation(() => [StaffEntity], { name: 'import' })
    @UsePipes(new ValidationPipe())
    async importStaff(@Args('importStaffInput') importStaffInput: ListImportStaff, @User('storeId') storeId: number,) {
        return this.staffService.importStaff(importStaffInput.list as StaffEntity[], storeId,);
    }

    @Query(() => [GraphQLJSON], { name: "calendar" })
    getBookingByStaff(@Args('queryBookingByStaff') queryBookingByStaff: QueryBookingByStaffInput, @User('storeId') storeId: number, @User('companyId') companyId: number) {
        return this.staffService.getBookingByStaff(queryBookingByStaff, storeId, companyId);
    }

    // @Mutation(() => StaffEntity)
    // @UsePipes(new ValidationPipe())
    // async updateStaff(@Args('updateStaffInput') updateStaffInput: UpdateStaffInput,) {
    //     await this.staffService.updateStaff(updateStaffInput as StaffEntity);
    //     const staff = await this.staffService.getStaff(updateStaffInput.id);
    //     pubSub.publish(STAFF_UPDATATE_EVENT, { staffUpdate: staff })
    //     return staff;
    // }

    @Mutation(() => ResultDeletInput, { name: 'breaktime' })
    async deleteBreakTime(@Args('id', { type: () => Int }) id: number) {
        return this.staffService.deleteBreakTime(id);
    }

    @Mutation(() => StaffEntity)
    async deleteStaff(@Args('id', { type: () => Int }) id: number) {
        return this.staffService.deleteStaff(id);
    }

    // @Subscription(() => StaffEntity, {
    //     name: 'staffUpdate',
    //     filter: async (_payload, _variables, context) => {
    //         const staff: StaffEntity = _payload.staffUpdate;
    //         const token = context.req.headers.authorization.split(' ')[1];
    //         const decode = jwt.verify(token, `${LIFE_SECRET}`) as DataStoredInToken;

    //         if (staff.storeId === decode.storeId) return true

    //         if (staff.booking.findIndex(_booking => _booking.storeId === decode.storeId) != -1) return true

    //         return false
    //     }
    // })
    // staffUpdate() {
    //     return pubSub.asyncIterator(STAFF_UPDATATE_EVENT)
    // }

}

