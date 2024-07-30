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
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

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
}
