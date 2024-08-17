import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { CommunityUser } from 'src/community/community-user/entities/communityUser.entity';
import { Artist } from 'src/admin/entities/artist.entity';
import _ from 'lodash';
import { User } from 'src/user/entities/user.entity';
import { Manager } from 'src/admin/entities/manager.entity';
import { MESSAGES } from 'src/constants/message.constant';
import { PartialUser } from 'src/user/interfaces/partial-user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
    @InjectRepository(CommunityUser)
    private readonly communityUserRepository: Repository<CommunityUser>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
  ) {}

  async create(
    userId: number,
    communityId: number,
    createPostDto: CreatePostDto,
    imageUrl: string[] | undefined,
  ) {
    const communityUser = await this.communityUserRepository.findOne({
      where: { userId: userId, communityId: communityId },
    });
    if (!communityUser) {
      throw new BadRequestException(MESSAGES.POST.CREATE.BAD_REQUEST);
    }
    const isArtist = await this.artistRepository.findOne({
      where: {
        communityUserId: communityUser.communityUserId,
        communityId: communityId,
      },
    });

    let artistId: number;
    if (isArtist) {
      artistId = isArtist.artistId;
    }
    const saveData = await this.postRepository.save({
      communityId: communityId,
      communityUserId: communityUser.communityUserId,
      title: createPostDto.title,
      content: createPostDto.content,
      artistId: artistId,
    });
    if (imageUrl && imageUrl.length > 0) {
      for (let image of imageUrl) {
        const postImageData = {
          postId: saveData.postId,
          postImageUrl: image,
        };
        await this.postImageRepository.save(postImageData);
      }
    }
    return {
      status: HttpStatus.CREATED,
      message: MESSAGES.POST.CREATE.SUCCEED,
      data: saveData,
    };
  }

  async findPosts(artistId: number | null, communityId: number) {
    if (!artistId) {
      const allPosts = await this.postRepository.find({
        where: { communityId: communityId },
        relations: ['postImages'],
      });

      return {
        status: HttpStatus.OK,
        message: MESSAGES.POST.FINDPOSTS.SUCCEED,
        data: allPosts,
      };
    } else if (artistId) {
      const artistPosts = await this.postRepository.find({
        where: { artistId: artistId, communityId: communityId },
        relations: ['postImages'],
      });

      return {
        status: HttpStatus.OK,
        message: MESSAGES.POST.FINDPOSTS.ARTIST,
        data: artistPosts,
      };
    }
  }

  async findOne(postId: number) {
    const data = await this.postRepository.findOne({
      where: { postId: postId },
      relations: ['postImages'],
    });
    if (!data) {
      throw new NotFoundException(MESSAGES.POST.FINDONE.NOT_FOUND);
    }
    return {
      status: HttpStatus.OK,
      message: MESSAGES.POST.FINDONE.SUCCEED,
      data: data,
    };
  }

  async update(
    userId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
    imageUrl: string[] | undefined,
  ) {
    const postData = await this.postRepository.findOne({
      where: { postId: postId },
    });
    const communityUser = await this.communityUserRepository.findOne({
      where: { userId: userId, communityId: postData.communityId },
    });
    if (!postData) {
      throw new NotFoundException(MESSAGES.POST.UPDATE.NOT_FOUND);
    }
    if (!communityUser) {
      throw new UnauthorizedException(MESSAGES.POST.UPDATE.UNAUTHORIZED);
    }
    if (_.isEmpty(updatePostDto.title && updatePostDto.content)) {
      throw new BadRequestException(MESSAGES.POST.UPDATE.BAD_REQUEST);
    }

    const newData = {
      title: postData.title,
      content: postData.content,
    };
    if (updatePostDto.title != postData.title) {
      newData.title = updatePostDto.title;
    }
    if (updatePostDto.content != postData.content) {
      newData.content = updatePostDto.content;
    }

    await this.postRepository.update({ postId: postId }, newData);

    if (imageUrl && imageUrl.length > 0) {
      //postId에 연결된 모든 postImage 데이터 삭제
      //의도 : DELETE FROM post_image WHERE post_id = postId
      await this.postImageRepository
        .createQueryBuilder()
        .delete()
        .from(PostImage)
        .where('post_id = :postId', { postId })
        .execute();

      //업로드된 이미지 숫자만큼 다시 생성
      for (let image of imageUrl) {
        const postImageData = {
          postId: postData.postId,
          postImageUrl: image,
        };
        await this.postImageRepository.save(postImageData);
      }
    }
    const updatedData = await this.postRepository.findOne({
      where: { postId: postId },
      relations: ['postImages'],
    });
    return {
      status: HttpStatus.OK,
      message: MESSAGES.POST.UPDATE.SUCCEED,
      data: updatedData,
    };
  }

  async remove(user: PartialUser, postId: number) {
    const userId = user.id;
    const managerId = user?.roleInfo?.roleId;
    const postData = await this.postRepository.findOne({
      where: { postId: postId },
    });
    const userData = await this.communityUserRepository.findOne({
      where: { userId: userId },
    });
    const isAdmin = await this.userRepository.findOne({
      where: { userId: userId },
    });
    const isManager = await this.managerRepository.findOne({
      where: { managerId: managerId },
    });
    if (
      postData.communityUserId == userData.communityUserId ||
      isManager.communityId == postData.communityId ||
      isAdmin.role == 'Admin'
    ) {
      await this.postRepository.delete(postId);
      return {
        status: HttpStatus.OK,
        message: MESSAGES.POST.REMOVE.SUCCEED,
        data: postId,
      };
    } else {
      throw new UnauthorizedException(MESSAGES.POST.REMOVE.UNAUTHORIZED);
    }
  }
}
