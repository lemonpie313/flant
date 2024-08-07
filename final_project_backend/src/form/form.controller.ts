import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/types/user-role.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserInfo } from 'src/util/decorators/user-info.decorator';

@ApiTags('Forms')
@Controller('v1/forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  /**
   * 폼 생성
   * @param createFormDto
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.Manager)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@UserInfo() user, @Body() createFormDto: CreateFormDto) {
    return await this.formService.create(createFormDto, user.id);
  }

  /**
   * 폼 상세 조회
   * @param formId
   * @returns
   */
  @Get('/:formId')
  async findOne(@Param('formId', ParseIntPipe) formId: number) {
    return await this.formService.findOne(formId);
  }

  /**
   * 폼 수정
   * @param formId
   * @param updateFormDto
   * @returns
   */
  @ApiBearerAuth()
  @Patch('/:formId')
  @Roles(UserRole.Manager)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('formId', ParseIntPipe) formId: number,
    @Body() updateFormDto: UpdateFormDto,
    @UserInfo() user,
  ) {
    return await this.formService.update(formId, updateFormDto, user.id);
  }

  /**
   * 폼 삭제
   * @param formId
   * @returns
   */
  @ApiBearerAuth()
  @Delete('/:formId')
  @Roles(UserRole.Manager)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(
    @Param('formId', ParseIntPipe) formId: number,
    @UserInfo() user,
  ) {
    return await this.formService.remove(formId, user.id);
  }
}
