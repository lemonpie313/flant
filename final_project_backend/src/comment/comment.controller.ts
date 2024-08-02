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
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { LikeService } from 'src/like/like.service';
import { CreateLikeDto } from 'src/like/dto/create-like.dto';
import { UserInfo } from 'src/util/user-info.decorator';
import { ApiResponse } from 'src/util/api-response.interface';
import { Like } from 'src/like/entities/like.entity';
import { ItemType } from 'src/like/types/itemType.types';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly likeService: LikeService,
  ) {}

  @Post() // POST 요청을 처리하여 댓글을 생성
  @ApiOperation({ summary: 'Create a comment' }) // Swagger 문서화
  @ApiBody({ type: CreateCommentDto })
  async create(@Body() commentData: CreateCommentDto): Promise<Comment> {
    return this.commentService.createComment(commentData);
  }

  @Get() // GET 요청을 처리하여 모든 댓글을 조회
  @ApiOperation({ summary: 'Get all comments' }) // Swagger 문서화
  async findAll(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  @Get(':id') // 특정 ID의 댓글을 조회
  @ApiOperation({ summary: 'Get a comment by ID' }) // Swagger 문서화
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @Patch(':id') // PATCH 요청을 처리하여 댓글을 업데이트
  @ApiOperation({ summary: 'Update a comment' }) // Swagger 문서화
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCommentDto }) // 수정된 부분
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() commentData: UpdateCommentDto, // 수정된 부분
  ): Promise<void> {
    return this.commentService.update(id, commentData);
  }

  @Delete(':id') // DELETE 요청을 처리하여 댓글을 삭제
  @ApiOperation({ summary: 'Delete a comment' }) // Swagger 문서화
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.commentService.remove(id);
  }

  // 특정 게시물의 댓글들 조회
  @Get('post/:postId')
  async findCommentsByPost(@Param('postId', ParseIntPipe) postId: number): Promise<Comment[]> {
    return this.commentService.findCommentsByPost(postId);
  }

  // 특정 댓글의 대댓글들 조회
  @Get('reply/:commentId')
  async findRepliesByComment(@Param('commentId', ParseIntPipe) commentId: number): Promise<Comment[]> {
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
