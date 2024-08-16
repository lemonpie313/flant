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
import { number } from 'joi';
import { ApplyType } from './types/form-apply-type.enum';

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
  async create(createFormDto: CreateFormDto, communityUserId: number) {
    const {
      title,
      content,
      formType,
      maxApply,
      spareApply,
      startTime,
      endTime,
      communityId,
    } = createFormDto;

    //커뮤니티 유효성 체크
    const community = await this.communityRepository.findOne({
      where: { communityId },
    });
    if (!community) {
      throw new NotFoundException('존재하지 않는 커뮤니티 입니다.');
    }

    //userId로 매니저 테이블의 정보를 가져와 해당 매니저 등록된 커뮤니티ID 와 입력한 커뮤니티 ID 값이 일치한지 확인
    const manager = await this.managerRepository.findOne({
      where: { communityUserId },
    });
    if (manager.communityId !== communityId) {
      throw new NotFoundException('해당 커뮤니티에 권한이 없는 매니저입니다.');
    }
    console.log('test 코드', title);
    //중복 제목 체크
    const titleCheck = await this.formRepository.findOne({
      where: { title },
    });
    console.log(titleCheck);
    if (titleCheck) {
      throw new BadRequestException('이미 존재하는 제목입니다.');
    }

    //폼 생성
    const createForm = await this.formRepository.save({
      title,
      content,
      formType,
      maxApply,
      spareApply,
      startTime,
      endTime,
      manager,
      community,
    });

    return {
      status: HttpStatus.CREATED,
      message: '폼 생성이 완료되었습니다',
      data: {
        formId: createForm.id,
        managerId: createForm.manager.managerId,
        communityId: createForm.community.communityId,
        title: createForm.title,
        content: createForm.content,
        formItemType: createForm.formType,
        maxApply: createForm.maxApply,
        spareApply: createForm.spareApply,
        startTime: createForm.startTime,
        endTime: createForm.endTime,
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

  async update(
    formId: number,
    updateFormDto: UpdateFormDto,
    communityUserId: number,
  ) {
    const {
      title,
      content,
      formType,
      maxApply,
      spareApply,
      startTime,
      endTime,
    } = updateFormDto;

    // 폼 유효성 체크
    const form = await this.formRepository.findOne({
      where: { id: formId },
      relations: ['manager', 'community'],
    });
    if (!form) {
      throw new NotFoundException('폼이 존재하지 않습니다.');
    }
    console.log(form);
    // form의 작성자와 수정 요청한 사용자가 일치한지 확인
    if (form.manager.communityUserId !== communityUserId) {
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
    if (formType !== undefined) {
      form.formType = formType;
    }
    if (maxApply !== undefined) {
      form.maxApply = maxApply;
    }
    if (spareApply !== undefined) {
      form.spareApply = spareApply;
    }
    if (startTime !== undefined) {
      form.startTime = startTime;
    }
    if (endTime !== undefined) {
      form.endTime = endTime;
    }

    //변경사항 저장
    await this.formRepository.save(form);

    return {
      status: HttpStatus.OK,
      message: '폼 수정 성공하였습니다.',
      data: {
        formId,
        formTitle: form.title,
        formContent: form.content,
        formType: form.formType,
        maxApply: form.maxApply,
        spareApply: form.spareApply,
        startTime: form.startTime,
        endTime: form.endTime,
      },
    };
  }

  async remove(formId: number, communityUserId: number) {
    // 폼 유효성 체크
    const form = await this.formRepository.findOne({
      where: { id: formId },
      relations: ['manager', 'community'],
    });
    if (!form) {
      throw new NotFoundException('폼이 존재하지 않습니다.');
    }

    // form의 작성자와 삭제 요청한 사용자가 일치한지 확인
    if (form.manager.communityUserId !== communityUserId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    await this.formRepository.softDelete(formId);

    return {
      status: HttpStatus.OK,
      message: '폼 삭제 성공하였습니다.',
      data: formId,
    };
  }

  async applyForm(userId: number, formId: number) {
    //폼 유효성 검사
    const form = await this.formRepository.findOne({
      where: { id: formId },
      relations: ['formItem'],
    });
    if (!form) {
      throw new BadRequestException('폼을 찾을 수 없습니다.');
    }

    //중복 신청 검사
    const userCheck = await this.formItemRepository.findOne({
      where: { userId },
    });
    // if (userCheck) {
    //   throw new BadRequestException('중복 신청은 불가능합니다');
    // }

    // 문자열을 date로 변환 후, 현재 시간이 시작 + 마감 시간이 아닐 경우 오류 반환
    const now = new Date();
    const startTime = new Date(form.startTime);
    const endTime = new Date(form.endTime);
    console.log(now, startTime, endTime);
    if (now < startTime || now > endTime) {
      throw new BadRequestException('신청 기간이 아닙니다.');
    }

    // 신청 인원 유효성 검사
    const nowTotalApply = form.formItem.length + 1; // 현재 신청인원
    const totalApply = form.maxApply + form.spareApply; // 총 신청인원
    const maxApply = form.maxApply; // 1차 선착순 인원

    //현재 신청자가, 총 신청자 보다 많을 경우
    if (nowTotalApply > totalApply) {
      throw new BadRequestException('선착순 마감되었습니다.');
    }

    // 현재신청자가 1차 신청자 수보다 적거나 동일할 경우엔 pass로 저장
    let finishForm;
    if (nowTotalApply <= maxApply) {
      finishForm = await this.formItemRepository.save({
        userId,
        applyType: ApplyType.Pass,
        form,
      });
    } // 현재신청자가 총 신청인원보다 적거나 동일하고, 1차 신청인원보다 클 경우엔 예비로 저장
    else if (nowTotalApply <= totalApply && nowTotalApply > maxApply) {
      finishForm = await this.formItemRepository.save({
        userId,
        applyType: ApplyType.Spare,
        form,
      });
    }

    return {
      status: HttpStatus.OK,
      message: '신청이 완료되었습니다.',
      data: { formId, ApplyStatus: finishForm.applyType },
    };
  }
}
