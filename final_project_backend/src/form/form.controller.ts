import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/types/user-role.type';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req, @Body() createFormDto: CreateFormDto) {
    const userId = req.user.id;
    return await this.formService.create(createFormDto, userId);
  }

  /**
   * 폼 상세 조회
   * @param formId
   * @returns
   */
  @Get('/:formId')
  async findOne(@Param('formId') formId: string) {
    return await this.formService.findOne(+formId);
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
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('formId') formId: string,
    @Body() updateFormDto: UpdateFormDto,
    @Req() req,
  ) {
    const userId = req.user.id;

    return await this.formService.update(+formId, updateFormDto, userId);
  }

  /**
   * 폼 삭제
   * @param formId
   * @returns
   */
  @ApiBearerAuth()
  @Delete('/:formId')
  @Roles(UserRole.Manager)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('formId') formId: string, @Req() req) {
    const userId = req.user.id;

    return await this.formService.remove(+formId, userId);
  }

  /**
   * 폼신청
   * @param formId
   * @param applyToFormDto
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/:formId')
  async applyForm(@Param('formId') formId: string, @Req() req) {
    const userId = req.user.id;

    return await this.formService.applyForm(userId, +formId);
  }
}
