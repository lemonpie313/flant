import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './entities/form.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FormItem } from './entities/form.item';
import { Manager } from '../admin/entities/manager.entity';
import { User } from 'src/user/entities/user.entity';
import { Community } from 'src/community/entities/community.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(FormItem)
    private readonly formItemRepository: Repository<FormItem>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
  ) {}

  //폼 생성
  async create(createFormDto: CreateFormDto, userId: number) {
    const { title, content, formItemContent, formItemType, communityId } =
      createFormDto;

    //커뮤니티 유효성 체크
    const community = await this.communityRepository.findOne({
      where: { communityId },
    });
    if (!community) {
      throw new NotFoundException('존재하지 않는 커뮤니티 입니다.');
    }

    //userId로 매니저 테이블의 정보를 가져와 해당 매니저 등록된 커뮤니티ID 와 입력한 커뮤니티 ID 값이 일치한지 확인
    const manager = await this.managerRepository.findOne({
      where: { userId },
    });
    if (manager.communityId !== communityId) {
      throw new NotFoundException('해당 커뮤니티에 권한이 없는 매니저입니다.');
    }

    //중복 제목 체크
    const titleCheck = await this.formRepository.findOne({
      where: { title },
    });
    if (titleCheck) {
      throw new BadRequestException('이미 존재하는 제목입니다.');
    }

    //폼 생성
    const createForm = await this.formRepository.save({
      title,
      content,
      manager,
      community,
    });

    //FormItem 데이터 저장
    const createFormItem = await this.formItemRepository.save({
      content: formItemContent,
      type: formItemType,
      form: createForm,
    });

    return {
      status: HttpStatus.CREATED,
      message: '폼 생성이 완료되었습니다',
      data: {
        title: createForm.title,
        content: createForm.content,
        managerId: createForm.manager.managerId,
        communityId: createForm.community.communityId,
        formItemType: createFormItem.type,
        formItemContent: createFormItem.content,
        createdAt: createForm.createdAt,
        updatedAt: createForm.updatedAt,
      },
    };
  }

  //폼 상세 조회
  async findOne(formId: number) {
    //폼 유효성 체크

    const form = await this.formRepository.findOne({
      where: { id: formId },
      relations: ['formItem'],
    });

    if (!form) {
      throw new NotFoundException('폼이 존재하지 않습니다.');
    }

    //deletedAt 제외
    const { deletedAt, ...result } = form;

    return {
      status: HttpStatus.OK,
      message: '폼 상세 조회에 성공하였습니다.',
      data: result,
    };
  }

  async update(formId: number, updateFormDto: UpdateFormDto, userId: number) {
    const { title, content, formItemContent, formItemType } = updateFormDto;

    // 폼 유효성 체크
    const form = await this.formRepository.findOne({
      where: { id: formId },
      relations: ['manager', 'community'],
    });
    if (!form) {
      throw new NotFoundException('폼이 존재하지 않습니다.');
    }

    // form의 작성자와 수정 요청한 사용자가 일치한지 확인
    if (form.manager.userId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    // formItem도 가져오기
    const formItem = await this.formItemRepository.findOne({
      where: { id: formId },
    });

    if (title !== undefined) {
      form.title = title;
    }
    if (content !== undefined) {
      form.content = content;
    }
    if (formItemContent !== undefined) {
      formItem.content = formItemContent;
    }
    if (formItemType !== undefined) {
      formItem.type = formItemType;
    }

    //변경사항 저장
    await this.formRepository.save(form);
    await this.formItemRepository.save(formItem);

    return {
      status: HttpStatus.OK,
      message: '폼 수정 성공하였습니다.',
      data: {
        formTitle: form.title,
        formContent: form.content,
        formItemContent: formItem.content,
        formItemType: formItem.type,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      },
    };
  }

  async remove(formId: number, userId: number) {
    // 폼 유효성 체크
    const form = await this.formRepository.findOne({
      where: { id: formId },
      relations: ['manager', 'community'],
    });
    if (!form) {
      throw new NotFoundException('폼이 존재하지 않습니다.');
    }

    // form의 작성자와 삭제 요청한 사용자가 일치한지 확인
    if (form.manager.userId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    await this.formRepository.softDelete(formId);

    return {
      status: HttpStatus.OK,
      message: '폼 삭제 성공하였습니다.',
      data: formId,
    };
  }
}
