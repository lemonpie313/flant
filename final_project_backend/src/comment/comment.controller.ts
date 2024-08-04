// src/comments/comment.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/util/decorators/user-info.decorator';
import { Like } from 'src/like/entities/like.entity';
import { CreateLikeDto } from 'src/like/dto/create-like.dto';
import { LikeService } from 'src/like/like.service';
import { User } from 'src/user/entities/user.entity';
import { ItemType } from 'src/like/types/itemType.types';
import { ApiResponse } from 'src/util/api-response.interface';

@ApiTags('댓글')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly likeService: LikeService,
  ) {}

  // 댓글 생성
  @Post()
  async create(@Body() commentData: CreateCommentDto): Promise<Comment> {
    return this.commentService.createComment(commentData);
  }

  // 대댓글 생성
  @Post('reply')
  async createReply(@Body() replyData: CreateReplyDto): Promise<Comment> {
    // 대댓글의 parentCommentId를 사용하여 대댓글을 생성합니다.
    return this.commentService.createComment(replyData); // 댓글 생성 메서드를 재사용
  }

  // 모든 댓글 조회
  @Get()
  async findAll(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  // 특정 댓글 조회
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  // 댓글 업데이트
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() commentData: Partial<Comment>,
  ): Promise<void> {
    return this.commentService.update(id, commentData);
  }

  // 댓글 삭제
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.commentService.remove(id);
  }

  // 특정 게시물의 댓글들 조회
  @Get('post/:postId')
  async findCommentsByPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<Comment[]> {
    return this.commentService.findCommentsByPost(postId);
  }

  // 특정 댓글의 대댓글들 조회
  @Get('reply/:commentId')
  async findRepliesByComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<Comment[]> {
    return this.commentService.findRepliesByComment(commentId);
  }

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
      ItemType.COMMENT,
    );
  }
}
