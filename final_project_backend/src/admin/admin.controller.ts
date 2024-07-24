import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/types/user-role.type';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('어드민')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * 아티스트 생성
   * @param CreateArtistDto
   */
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @UseGuards(RolesGuard)
  @Post('artists')
  async createArtist(@Body() createArtistDto: CreateArtistDto) {
    const data = await this.adminService.createArtist(createArtistDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: `아티스트 생성에 성공했습니다.`,
      data,
    };
  }

  /**
   * 아티스트 삭제
   * @param artistId
   */
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @UseGuards(RolesGuard)
  @Post('artists/:artistId')
  async deleteArtist(@Param() artistId: number) {
    await this.adminService.deleteArtist(artistId);
    return {
      statusCode: HttpStatus.CREATED,
      message: `아티스트 삭제 성공했습니다.`,
    };
  }

  /**
   * 매니저 생성
   * @param CreateManagerDto
   */
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @UseGuards(RolesGuard)
  @Post('managers')
  async createManager(@Body() createManagerDto: CreateManagerDto) {
    const data = await this.adminService.createManager(createManagerDto);
    return {
      statusCode: HttpStatus.OK,
      message: `매니저 생성에 성공했습니다.`,
      data,
    };
  }

  /**
   * 매니저 삭제
   * @param managerId
   */
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @UseGuards(RolesGuard)
  @Post('managers/:managerId')
  async deleteManager(@Param() managerId: number) {
    await this.adminService.deleteManager(managerId);
    return {
      statusCode: HttpStatus.OK,
      message: `매니저 삭제 성공했습니다.`,
    };
  }
}
