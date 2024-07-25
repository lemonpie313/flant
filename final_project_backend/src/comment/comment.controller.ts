import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() commentData: Partial<Comment>): Promise<Comment> {
    return this.commentService.createComment(commentData);
  }

  @Get()
  async findAll(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() commentData: Partial<Comment>,
  ): Promise<void> {
    return this.commentService.update(id, commentData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.commentService.remove(id);
  }

  @Get('post/:postId')
  async findCommentsByPost(@Param('postId') postId: number): Promise<Comment[]> {
    return this.commentService.findCommentsByPost(postId);
  }

  @Get('reply/:commentId')
  async findRepliesByComment(@Param('commentId') commentId: number): Promise<Comment[]> {
    return this.commentService.findRepliesByComment(commentId);
  }
}
