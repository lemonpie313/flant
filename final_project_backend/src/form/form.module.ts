import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { Form } from './entities/form.entity';
import { ApplyUser } from './entities/apply-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Manager } from 'src/admin/entities/manager.entity';
import { Community } from 'src/community/entities/community.entity';
import { FormQuestion } from './entities/form-question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Form,
      FormQuestion,
      ApplyUser,
      User,
      Manager,
      Community,
    ]),
  ],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
