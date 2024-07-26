import {
  BadRequestException,
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

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(FormItem)
    private readonly formItemRepository: Repository<FormItem>,
  ) {}

  //폼 생성
  async create(createFormDto: CreateFormDto /* 커뮤니티id, 매니저 id 받기 */) {
    // 전달 받은 커뮤니티 Id 유효성 + 받은 매니저 id가 매니저 그룹에 있는지 유효성 체크

    const { title, content, formItemContent, formItemType } = createFormDto;

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
    });

    //FormItem 데이터 저장
    await this.formItemRepository.save({
      content: formItemContent,
      type: formItemType,
      form: createForm,
    });

    return {
      status: HttpStatus.CREATED,
      message: '폼 생성이 완료되었습니다',
      data: createForm,
    };
  }

  //폼 상세 조회
  async findOne(formId: number) {
    //폼 유효성 체크

    const form = await this.formRepository.findOne({
      where: { id: formId },
      relations: ['formItem'],
    });
    console.log('test2');
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

  async update(formId: number, updateFormDto: UpdateFormDto) {
    // 사용자 검증

    // 폼 유효성 체크
    const form = await this.formRepository.findOne({
      where: { id: formId },
    });

    if (!form) {
      throw new NotFoundException('폼이 존재하지 않습니다.');
    }

    // form id가 있을 경우 formItem도 가져오기
    const formItem = await this.formItemRepository.findOne({
      where: { id: formId },
    });

    const { title, content, formItemContent, formItemType } = updateFormDto;

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

  async remove(formId: number) {
    // 사용자 검증

    // 폼 유효성 체크
    const form = await this.formRepository.findOne({
      where: { id: formId },
    });

    if (!form) {
      throw new NotFoundException('폼이 존재하지 않습니다.');
    }

    await this.formRepository.softDelete(formId);

    return {
      status: HttpStatus.OK,
      message: '폼 삭제 성공하였습니다.',
      data: formId,
    };
  }
}
