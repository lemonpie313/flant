import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto) {
    return createPostDto;
  }

  async findPosts(artistId: number | null, communityId: number) {
    if (!artistId) {
      const allPosts = await this.postRepository.find({
        where: { communityId: communityId },
      });
      return {
        status: HttpStatus.OK,
        message: '게시글 조회에 성공했습니다.',
        
      }
    }
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return updatePostDto;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
