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
import { CommunityUser } from 'src/community/entities/communityUser.entity';
import { Artist } from 'src/admin/entities/artist.entity';
import _ from 'lodash';
import { User } from 'src/user/entities/user.entity';
import { Manager } from 'src/admin/entities/manager.entity';

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
  ) {
    const isCommunityUser = await this.communityUserRepository.findOne({
      where: { userId: userId, communityId: communityId },
    });
    if (!isCommunityUser) {
      throw new BadRequestException('커뮤니티 가입을 먼저 진행해주세요.');
    }
    const isArtist = await this.artistRepository.findOne({
      where: { userId: userId },
    });
    if (isArtist) {
      createPostDto.artistId = isArtist.artistId;
    }

    const saveData = await this.postRepository.save(createPostDto);
    if (createPostDto.postImageUrl) {
      const postImageData = {
        postId: saveData.postId,
        postImageUrl: createPostDto.postImageUrl,
      };
      await this.postImageRepository.save(postImageData);
    }
    return {
      status: HttpStatus.CREATED,
      message: '게시물 등록에 성공했습니다.',
      data: saveData,
    };
  }

  async findPosts(artistId: number | null, communityId: number) {
    if (!artistId) {
      const allPosts = await this.postRepository.find({
        where: { communityId: communityId },
      });
      return {
        status: HttpStatus.OK,
        message: '게시글 조회에 성공했습니다.',
        data: allPosts,
      };
    } else if (artistId) {
      const artistPosts = await this.postRepository.find({
        where: { artistId: artistId, communityId: communityId },
      });
      return {
        status: HttpStatus.OK,
        message: '해당 아티스트 게시글 조회에 성공했습니다.',
        data: artistPosts,
      };
    }
  }

  async findOne(postId: number) {
    const data = await this.postRepository.findOne({
      where: { postId: postId },
      relations: ['postImages'],
    });
    if(!data){
      throw new NotFoundException('게시글이 존재하지 않습니다.')
    }
    return {
      status: HttpStatus.OK,
      message: '게시글 조회에 성공했습니다.',
      data: data,
    };
  }

  async update(userId: number, postId: number, updatePostDto: UpdatePostDto) {
    const isCommunityUser = await this.communityUserRepository.findOne({
      where: { userId: userId },
    });
    if (!isCommunityUser) {
      throw new BadRequestException('먼저 커뮤니티에 가입해주세요');
    }
    if (_.isEmpty(updatePostDto)) {
      throw new BadRequestException('수정할 내용을 입력해주세요.');
    }
    await this.postRepository.update(
      { postId: postId },
      { title: updatePostDto.title, content: updatePostDto.content },
    );
    const updatedData = await this.postRepository.findOne({
      where: { postId: postId },
    });
    return {
      status: HttpStatus.OK,
      message: '게시물 조회에 성공했습니다.',
      data: updatedData,
    };
  }

  async remove(userId: number, postId: number) {
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
      where: { userId: userId },
    });
    if (
      postData.communityUserId == userData.communityUserId ||
      isManager.communityId == postData.communityId ||
      isAdmin.role == 'Admin'
    ) {
      await this.postRepository.delete(postId);
      return {
        status: HttpStatus.OK,
        message: '게시글이 삭제되었습니다.',
        data: postId,
      };
    } else {
      throw new UnauthorizedException('게시글 삭제 권한이 없습니다.');
    }
  }
}
