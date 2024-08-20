import {
  BadRequestException,
  ConsoleLogger,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { CommunityUser } from 'src/community/community-user/entities/communityUser.entity';
import { Artist } from 'src/admin/entities/artist.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import _ from 'lodash';
import { User } from 'src/user/entities/user.entity';
import { Manager } from 'src/admin/entities/manager.entity';
import { MESSAGES } from 'src/constants/message.constant';
import { PartialUser } from 'src/user/interfaces/partial-user.entity';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';

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
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    userId: number,
    createPostDto: CreatePostDto,
    imageUrl: string[] | undefined,
  ) {
    const communityUser = await this.communityUserRepository.findOne({
      where: { userId: userId, communityId: +createPostDto.communityId },
    });
    if (!communityUser) {
      throw new BadRequestException(MESSAGES.POST.CREATE.BAD_REQUEST);
    }
    const isArtist = await this.artistRepository.findOne({
      where: {
        communityUserId: communityUser.communityUserId,
        communityId: +createPostDto.communityId,
      },
    });

    let artistId: number;
    if (isArtist) {
      artistId = isArtist.artistId;
    }
    const saveData = await this.postRepository.save({
      communityId: +createPostDto.communityId,
      communityUserId: communityUser.communityUserId,
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

  async findPosts(isArtist: boolean, communityId: number) {
    if (!isArtist) {
      const [allPosts, total] = await this.postRepository.findAndCount({
        where: {
          communityId: communityId,
          artistId: IsNull(),
        },
        relations: {
          postImages: true,
          communityUser: {
            users: true,
          },
        },
        order: { createdAt: 'DESC' }, // 최신 게시물 순으로 정렬 (필요 시 추가)
      });

      const posts = allPosts.map((post) => {
        return {
          postId: post.postId,
          nickname: post.communityUser.nickName,
          profileImage: post.communityUser.users.profileImage,
          isArtist: post.artistId !== null, // artistId가 존재하면 아티스트로 간주
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          postImages: post.postImages.map((image) => ({
            postImageId: image.postImageId,
            postImageUrl: image.postImageUrl,
          })),
        };
      });

      return {
        status: HttpStatus.OK,
        message: MESSAGES.POST.FINDPOSTS.SUCCEED,
        data: posts,
        total, // 총 게시물 수 반환
      };
    } else {
      const [artistPosts, total] = await this.postRepository.findAndCount({
        where: {
          communityId: communityId,
          artistId: Not(IsNull()),
        },
        relations: {
          postImages: true,
          communityUser: {
            users: true,
          },
        },
        order: { createdAt: 'DESC' }, // 최신 게시물 순으로 정렬 (필요 시 추가)
      });

      const posts = artistPosts.map((post) => {
        return {
          postId: post.postId,
          nickname: post.communityUser.nickName,
          profileImage: post.communityUser.users.profileImage,
          isArtist: post.artistId !== null, // artistId가 존재하면 아티스트로 간주
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          postImages: post.postImages.map((image) => ({
            postImageId: image.postImageId,
            postImageUrl: image.postImageUrl,
          })),
        };
      });

      return {
        status: HttpStatus.OK,
        message: MESSAGES.POST.FINDPOSTS.ARTIST,
        data: posts,
        total, // 총 게시물 수 반환
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
    if (_.isEmpty(updatePostDto.content)) {
      throw new BadRequestException(MESSAGES.POST.UPDATE.BAD_REQUEST);
    }

    const newData = {
      content: postData.content,
    };
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

  /**
   * 새로운 댓글을 생성합니다.
   * @param commentData - 생성할 댓글의 데이터
   * @returns 생성된 댓글
   */
  async createCommentByPost(
    postId: number,
    user: PartialUser,
    createCommentDto,
  ) {
    const userId = user.id;

    const postData = await this.postRepository.findOne({
      where: { postId: postId },
    });

    if (!postData) {
      throw new NotFoundException(MESSAGES.POST.UPDATE.NOT_FOUND);
    }

    const communityUser = await this.communityUserRepository.findOne({
      where: { userId: userId, communityId: createCommentDto.communityId },
    });
    if (!communityUser) {
      throw new UnauthorizedException(MESSAGES.COMMENT.CREATE.BAD_REQUEST);
    }
    if (_.isEmpty(createCommentDto.comment)) {
      throw new BadRequestException(MESSAGES.COMMENT.COMMON.COMMENT);
    }

    const communityUserId = communityUser.communityUserId;
    const artistId = createCommentDto?.artistId;
    const requestData = {
      postId,
      communityUserId,
      artistId,
      comment: createCommentDto.comment,
    };

    const comment = await this.commentRepository.save(requestData); // 댓글 엔티티 인스턴스 생성
    return comment; // 댓글을 데이터베이스에 저장
  }

  /**
   * 특정 게시물에 대한 댓글을 조회합니다.
   * @param postId - 게시물의 ID
   * @returns 해당 게시물의 댓글 배열
   */
  async findCommentsByPost(postId: number) {
    const comments = await this.commentRepository.find({
      where: { postId },
      // relations: {
      //   communityUser: {
      //     users: true,
      //   },
      // },
      relations: ['communityUser', 'communityUser.users'],
      order: { createdAt: 'DESC' }, // 최신 게시물 순으로 정렬 (필요 시 추가)
    });

    console.log(comments);
    const commentList = comments.map((comment) => {
      // console.log(comment.communityUser);
      return {
        postId: comment.postId,
        author: comment.communityUser.nickName,
        profileImage: comment.communityUser.users.profileImage,
        // isArtist: comment.artistId !== null, // artistId가 존재하면 아티스트로 간주
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });
    return commentList;
  }
}
