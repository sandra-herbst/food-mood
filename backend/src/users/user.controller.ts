import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SwaggerResponseConfig } from '../config/swagger';
import { UpdateUserDto, UserRO } from './dto';
import { User } from './entity/user.entity';
import { ApiFile, UserData } from '../common/decorators';
import { ParseFile } from '../common/pipes';
import { JwtAuthGuard } from '../common/guards';
import { GetIdResourceResponse } from '../common/decorators/swagger';
import { GetAllResourceResponse } from '../common/decorators/swagger';
import { DeleteIdResourceResponse } from '../common/decorators/swagger';
import { PostResourceResponse } from '../common/decorators/swagger';
import { ApiFileBody } from '../common/decorators';
import { PatchIdResourceResponse } from '../common/decorators/swagger';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Update a user by a specific id. Can be updated partially (E.g. only email, only password...)
   * Only the user associated with the id can update themselves.
   * Admins can update any user.
   */
  @Patch(':id')
  @PatchIdResourceResponse()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UserData() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserRO> {
    return UserRO.fromEntity(await this.userService.updateUserById(user, id, updateUserDto));
  }

  /**
   * Upload an image for a specific user id. The previous image will be deleted.
   * Only the user associated with the id can upload an image for their account.
   * Admins can upload an image for any user.
   */
  @Post(':id/image')
  @ApiFile('/users')
  @ApiFileBody()
  @PostResourceResponse()
  @ApiNotFoundResponse(SwaggerResponseConfig.API_RES_NOTFOUND)
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UserData() user: User,
    @UploadedFile(ParseFile) file: Express.Multer.File,
  ): Promise<void> {
    await this.userService.updateUserImageById(user, id, file);
  }

  /**
   * Delete the current image for a specific user id.
   * Only the user associated with the id can delete the image.
   * Admins can delete any image.
   */
  @Delete(':id/image')
  @DeleteIdResourceResponse()
  async deleteImage(@Param('id', ParseIntPipe) id: number, @UserData() user: User): Promise<void> {
    await this.userService.deleteUserImageById(user, id);
  }

  /**
   * Delete a user by a specific id.
   * Only the user associated with the id can delete themselves.
   * Admins can delete anyone.
   */
  @Delete(':id')
  @DeleteIdResourceResponse()
  async deleteUser(@Param('id', ParseIntPipe) id: number, @UserData() user: User): Promise<void> {
    await this.userService.deleteUserById(user, id);
  }

  /**
   * Get all users that are currently registered.
   * Admin only.
   */
  @Get()
  @GetAllResourceResponse()
  async findAll(@UserData() user: User): Promise<UserRO[]> {
    return await this.userService.findAll(user).then((users) => users.map((e) => UserRO.fromEntity(e)));
  }

  /**
   * Get a user by a specific id.
   * Users can only get information of themselves.
   * Admins can retrieve any user information.
   */
  @Get(':id')
  @GetIdResourceResponse()
  async findOne(@Param('id', ParseIntPipe) id: number, @UserData() user: User): Promise<UserRO> {
    return UserRO.fromEntity(await this.userService.findUserById(user, id));
  }
}
