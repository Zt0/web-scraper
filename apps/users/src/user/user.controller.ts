import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {ApiResponse, ApiTags} from '@nestjs/swagger'
import {ResponseWrapper} from '@libs/common/dto/response-wrapper.dto'
import {UserDTO} from '@libs/common/dto/user.dto'
import {UserService} from '@apps/users/user/services/user.service'
import {JwtAuthGuard} from '@libs/common/guards/jwt-auth.guard'
import {AuthInterceptor} from '@libs/common/interceptors/auth-interceptor.service'
import {Response} from '@libs/common/dto/response-status.dto'
import {RequestWithUUID} from '@libs/common/types/request'

@ApiTags('User')
@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({type: UserDTO})
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req: RequestWithUUID): Promise<ResponseWrapper<UserDTO>> {
    const user = await this.userService.getUser(req.uuid)
    return ResponseWrapper.actionSucceed(user)
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({type: Response})
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async createUser(@Body() userDTO: UserDTO, @Req() req: RequestWithUUID): Promise<Response> {
    await this.userService.createUser(userDTO, req.uuid)
    return ResponseWrapper.actionSucceed()
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({type: Response})
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Body() userDTO: Partial<UserDTO>,
    @Req() req: RequestWithUUID,
  ): Promise<ResponseWrapper> {
    await this.userService.updateUser(userDTO, req.uuid)
    return ResponseWrapper.actionSucceed()
  }
}
