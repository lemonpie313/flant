import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { Form } from './entities/form.entity';
import { FormItem } from './entities/form.item';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormItem])],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
