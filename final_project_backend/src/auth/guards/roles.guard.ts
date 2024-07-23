import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/user/types/user-role.type';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  @InjectRepository(User) private readonly userRepository: Repository<User>;
  constructor(private reflector: Reflector) {
    super();
  } // reflector로 인해 role을 가져옴
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 먼저 jwt인증이 잘되는지 확인
    const authenticated = await super.canActivate(context);
    if (!authenticated)
      throw new UnauthorizedException('인증 정보가 잘못되었습니다.');

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const user = await this.userRepository.findOneBy({ user_id: userId });

    const hasPermission = requiredRoles.some((role) => role === user.role);
    if (!hasPermission) throw new ForbiddenException('권한이 없습니다.');
    return hasPermission;
  }
}
