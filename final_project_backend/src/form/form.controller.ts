import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Forms')
@Controller('forms')
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
   * @param id
   * @returns
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.formService.findOne(+id);
  }

  /**
   * 폼 수정
   * @param id
   * @param updateFormDto
   * @returns
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.update(+id, updateFormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formService.remove(+id);
  }
}
