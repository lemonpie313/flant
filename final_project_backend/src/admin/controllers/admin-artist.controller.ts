import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminArtistService } from '../services/admin-artist.service';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/types/user-role.type';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('어드민')
@Controller('admin')
export class AdminArtistController {
  constructor(private readonly adminArtistService: AdminArtistService) {}

  /**
   * 아티스트 생성
   * @param CreateArtistDto
   */
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @UseGuards(RolesGuard)
  @Post('artists')
  async createArtist(@Body() createArtistDto: CreateArtistDto) {
    const data = await this.adminArtistService.createArtist(createArtistDto);
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
  @Delete('artists/:artistId')
  async deleteArtist(@Param('artistId') artistId: number) {
    await this.adminArtistService.deleteArtist(artistId);
    return {
      statusCode: HttpStatus.CREATED,
      message: `아티스트 삭제 성공했습니다.`,
    };
  }
}
