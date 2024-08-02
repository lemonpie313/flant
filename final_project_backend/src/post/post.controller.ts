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
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/util/user-info.decorator';
import { CreateLikeDto } from 'src/like/dto/create-like.dto';
import { ApiResponse } from 'src/util/api-response.interface';
import { Like } from 'src/like/entities/like.entity';
import { ItemType } from 'src/like/types/itemType.types';
import { LikeService } from 'src/like/like.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { postImageUploadFactory } from 'src/factory/post-image-upload.factory';
import { ApiFiles } from 'src/util/api-file.decorator';

@ApiTags('게시물')
@Controller('v1/post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly likeService: LikeService,
  ) {}

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
  @ApiFiles('postImage', 10, postImageUploadFactory())
  @Post()
  async create(
    @UploadedFiles() files: Express.MulterS3.File[],
    @Request() req,
    @Query('communityId') communityId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    let imageUrl = undefined
    if(files.length != 0){
      const imageLocation = files.map(file => file.location);
      imageUrl = JSON.stringify(imageLocation)
    }
    const userId = req.user.id;
    return await this.postService.create(+userId, +communityId, createPostDto, imageUrl);
  }

  /**
   * 게시물 전체 조회(권한 불필요)
   * @param artistId
   * @param communityId
   * @returns
   */
  @Get()
  @ApiQuery({ name: 'artistId', required: false, type: Number })
  @ApiQuery({ name: 'communityId', required: true, type: Number })
  async findPosts(
    @Query('artistId') artistId: number,
    @Query('communityId') communityId: number,
  ) {
    return await this.postService.findPosts(+artistId, +communityId);
  }

  /**
   * 게시물 상세 조회(권한 불필요)
   * @param postId
   * @returns
   */
  @Get(':postId')
  async findOne(@Param('postId') postId: number) {
    return await this.postService.findOne(+postId);
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
  async update(
    @Request() req,
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userId = req.userId;
    return await this.postService.update(+userId, +postId, updatePostDto);
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
  async remove(@Request() req, @Param('postId') postId: number) {
    const userId = req.user.id;
    return await this.postService.remove(+userId, +postId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id/likes')
  async updateLikeStatus(
    @UserInfo() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() createLikeDto: CreateLikeDto,
  ): Promise<ApiResponse<Like>> {
    return this.likeService.updateLikeStatus(
      user.id,
      id,
      createLikeDto,
      ItemType.POST,
    );
  }
}
