import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // 내 정보 조회
  async findMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const response = {
      id: user.user_id,
      email: user.email,
      name: user.name,
      profile_image: user.profile_image,
      role: user.role,
    };

    return response;
  }

  // 다른 사람 정보 조회
  async findUser(userId: number) {
    const user = await this.userRepository.findOneBy({
      user_id: userId,
    });
    const response = {
      id: user.user_id,
      email: user.email,
      name: user.name,
      profile_image: user.profile_image,
      role: user.role,
    };

    return response;
  }

  // 내 정보 수정
  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const { password, name, newPassword, newPasswordConfirm, profile_image } =
      updateUserDto;
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      select: { password: true },
    });

    // 현재 비밀번호가 일치한지 확인
    const isPasswordMatched = bcrypt.compareSync(
      password,
      user?.password ?? '',
    );

    if (!isPasswordMatched)
      throw new BadRequestException('기존 비밀번호와 일치하지 않습니다.');

    // 새로운 비밀번호와 확인이 일치한지 확인
    if (newPassword) {
      const isNewPasswordMatched = newPassword === newPasswordConfirm;
      if (!isNewPasswordMatched) {
        throw new BadRequestException(
          '새 비밀번호와 새 비밀번호 확인이 서로 일치하지 않습니다.',
        );
      }
    }
    // 비밀번호 뭉개기
    const hashRounds = this.configService.get<number>('PASSWORD_HASH');
    const hashedPassword = bcrypt.hashSync(newPassword, hashRounds);
    console.log(hashedPassword);

    // 회원 정보 수정 로직
    // update 조건
    const whereCondition = userId;
    // update 내용
    const whereContent = {
      ...(name && { name }),
      ...(newPassword && { password: hashedPassword }),
      ...(profile_image && { profile_image }),
    };
    const updateUser = await this.userRepository.update(
      whereCondition,
      whereContent,
    );

    return updateUser;
  }

  // 회원 탈퇴
  async deleteUser(userId: number, password: string) {
    // 비밀번호 일치한지 확인
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      select: { password: true },
    });
    console.log(user.password);
    const isPasswordMatched = bcrypt.compareSync(
      password,
      user?.password ?? '',
    );

    if (!isPasswordMatched)
      throw new BadRequestException('기존 비밀번호와 일치하지 않습니다.');

    // 회원 삭제 로직
    await this.userRepository.delete({ user_id: userId });

    return true;
  }
}
