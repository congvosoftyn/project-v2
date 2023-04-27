import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Res, UseGuards, UsePipes, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { PostDataDto } from './dto/PostData.dto';
import { User } from './decorators/user.decorator';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { LoginDto } from './dto/login.dto';
import { QueryLogoutDto } from './dto/query-logout.dto';
import { BusinessType } from 'src/config';
import { Request, Response } from 'express';
import { toAbsoluteUrl } from 'src/shared/utils/util';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() _user: CreateUserDto) {
    return this.userService.signup(_user);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.userService.signin(body);
  }

  @Get('logout')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  logout(@Query() { refreshToken, deviceToken }: QueryLogoutDto, @User('userId') userId: number) {
    return this.userService.logout(refreshToken, userId, deviceToken);
  }

  @Post('refreshToken')
  // @UsePipes(new ValidationPipe())
  refreshToken(@Body() _postData: PostDataDto) {
    return this.userService.refreshToken(_postData);
  }

  @Get('user/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async getUserByID(@Param('userId') userId: number) {
    return this.userService.findOneUser(userId);
  }

  @Put('update/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async updateUser(@Body() user: CreateUserDto, @Param("userId") userId: number) {
    return this.userService.updateUser(user, userId);
  }

  @Delete(':userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }

  @Post('fblogin')
  fbLogin(@Body() body: FirebaseAuthDto, @Headers('authorization') idToken: string,) {
    return this.userService.socialLogin(body, { idToken, isFacebook: true });
  }

  @Post('gglogin')
  gglogin(@Body() body: FirebaseAuthDto, @Headers('authorization') idToken: string,) {
    return this.userService.socialLogin(body, { idToken, isGoogle: true });
  }

  @Post('applelogin')
  applelogin(@Body() body: FirebaseAuthDto, @Headers('authorization') idToken: string,) {
    return this.userService.socialLogin(body, { idToken, isApple: true });
  }

  @Post('/facebook/deletion')
  parseSignedRequest(@Req() request: Request, @Res() response: Response) {
    const confirmationCode = this.userService.getConfirmationCode();
    const path = `/facebook/deletion-status?code=${confirmationCode}`;
    const url = toAbsoluteUrl(request, path)
    response.type('json');
    return response.send(`{ url: '${url}'}, confirmation_code: '${confirmationCode}'`);
  }

  @Get('/facebook/deletion-status')
  deletionStatus(@Res() response: Response, @Query('code') code: number) {
    return response.status(HttpStatus.OK).json({ code });
  }

  @Get("/suggest-business-type")
  getSuggessBusinessType() {
    return BusinessType
  }
}
