import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { Form } from './entities/form.entity';
import { FormItem } from './entities/form.item';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Manager } from 'src/admin/entities/manager.entity';
import { Community } from 'src/community/entities/community.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, FormItem, User, Manager, Community]),
  ],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
