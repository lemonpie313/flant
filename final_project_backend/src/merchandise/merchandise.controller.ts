import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';
import { CreateMerchandiseDto } from './dto/create-marchandise-post.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('상품')
@Controller('merchandise')
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  //상품 등록
  @Post()
  async create(@Body() createMerchandiseDto: CreateMerchandiseDto) {
    const data = await this.merchandiseService.create(createMerchandiseDto);
    return data;
  }

  @Get()
  findAll() {
    return this.merchandiseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.merchandiseService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.merchandiseService.remove(+id);
  }
}
