import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Forms')
@Controller('v1/forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  /**
   * 폼 생성
   * @param createFormDto
   * @returns
   */
  @Post()
  async create(
    @Body() createFormDto: CreateFormDto /* communityId, managerId도 받기 */,
  ) {
    return await this.formService.create(createFormDto);
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
  @Patch('/:formId')
  async update(
    @Param('formId') formId: string,
    @Body() updateFormDto: UpdateFormDto,
    /* 작성자 id 추가 필요 */
  ) {
    return await this.formService.update(+formId, updateFormDto);
  }

  /**
   * 폼 삭제
   * @param formId
   * @returns
   */
  @Delete('/:formId')
  async remove(@Param('formId') formId: string) {
    //사용자 id도 추가하여 전달 필요
    return await this.formService.remove(+formId);
  }
}
