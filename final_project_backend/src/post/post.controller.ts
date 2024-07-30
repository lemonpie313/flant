import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('게시물')
@Controller('v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * 게시글 작성
   * @param files
   * @param req
   * @param communityId
   * @param createPostDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'postImage', maxCount: 3 }]))
  async create(
    @UploadedFiles() files: Express.MulterS3.File[],
    @Request() req,
    @Query('communityId') communityId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    const imageUrl = files.map((file) => file.location);
    createPostDto.postImageUrl = JSON.stringify(imageUrl);
    const userId = req.userId;
    return await this.postService.create(+userId, +communityId, createPostDto);
  }

  /**
   * 게시물 전체 조회(권한 불필요)
   * @param artistId
   * @param communityId
   * @returns
   */
  @Get()
  findPosts(
    @Query('artistId') artistId: number | null,
    @Query('communityId') communityId: number,
  ) {
    return this.postService.findPosts(+artistId, +communityId);
  }

  /**
   * 게시물 상세 조회(권한 불필요)
   * @param postId
   * @returns
   */
  @Get(':postId')
  findOne(@Param('postId') postId: number) {
    return this.postService.findOne(+postId);
  }

  /**
   * 게시물 수정
   * @param req
   * @param postId
   * @param updatePostDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':postId')
  update(
    @Request() req,
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userId = req.userId;
    return this.postService.update(+userId, +postId, updatePostDto);
  }

  /**
   * 게시물 삭제
   * @param req
   * @param postId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':postId')
  remove(@Request() req, @Param('postId') postId: number) {
    const userId = req.user.id;
    return this.postService.remove(+userId, +postId);
  }
}
