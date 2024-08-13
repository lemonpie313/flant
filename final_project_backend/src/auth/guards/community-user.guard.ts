import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CommunityUserService } from 'src/community/community-user/community-user.service';
import { MESSAGES } from 'src/constants/message.constant';
import {
  COMMUNTIY_USER_ROLES_KEY,
  CommunityUserRoles,
} from '../decorators/community-user-roles.decorator';
import _ from 'lodash';
import { CommunityUserRole } from 'src/community/community-user/types/community-user-role.type';
import { AdminArtistService } from 'src/admin/services/admin-artist.service';
import { AdminManagerService } from 'src/admin/services/admin-manager.service';

@Injectable()
export class CommunityUserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly communityUserService: CommunityUserService,
    private readonly artistService: AdminArtistService,
    private readonly managerService: AdminManagerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: CommunityUserRole[] = this.reflector.get(
      COMMUNTIY_USER_ROLES_KEY,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();

    const userId = request.user?.id;
    let { communityId } = request.body;
    if (request?.params?.communityId) communityId = request.params.communityId;
    console.log(request.params);
    if (!userId) {
      throw new NotFoundException(MESSAGES.AUTH.COMMON.COMMUNITY_USER.NO_USER);
    }

    if (!communityId) {
      throw new NotFoundException(
        MESSAGES.AUTH.COMMON.COMMUNITY_USER.NO_COMMUNITY,
      );
    }
    console.log("-------------------")
    console.log(userId);
    console.log(communityId);
    // Roles 지정하지 않을 경우 communityUser만 검사
    if (_.isEmpty(roles)) {
      await this.communityUserService.findByCommunityIdAndUserId(
        communityId,
        userId,
      );
      return true;
    }

    // Roles 설정시 Roles(ARIST,MANAGER) + communityUser 검사

    let hasRole = false;
    console.log("----------------");
    console.log(roles);
    if (roles.includes(CommunityUserRole.ARTIST)) {
      try {
        console.log('--------------------------------------')
        const data =await this.artistService.findByCommunityIdAndUserId(
          communityId,
          userId,
        );
        console.log(data);
        hasRole = true;
      } catch (e) {}
    }

    if (roles.includes(CommunityUserRole.MANAGER)) {
      try {
        await this.managerService.findByCommunityIdAndUserId(
          communityId,
          userId,
        );
        hasRole = true;
      } catch (e) {}
    }

    if (!hasRole) {
      throw new ForbiddenException(MESSAGES.AUTH.COMMON.FORBIDDEN);
    }

    return true;
  }
}
