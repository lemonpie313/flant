import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments') // Swagger 태그 지정
@Controller('comments') // 'comments' 경로로 접근할 수 있는 컨트롤러
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

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

  @Get('post/:postId') // 특정 포스트의 모든 댓글을 조회
  @ApiOperation({ summary: 'Get comments by post ID' }) // Swagger 문서화
  @ApiParam({ name: 'postId', type: Number })
  async findCommentsByPost(@Param('postId', ParseIntPipe) postId: number): Promise<Comment[]> {
    return this.commentService.findCommentsByPost(postId);
  }

  @Get('reply/:commentId') // 특정 댓글의 모든 대댓글을 조회
  @ApiOperation({ summary: 'Get replies by comment ID' }) // Swagger 문서화
  @ApiParam({ name: 'commentId', type: Number })
  async findRepliesByComment(@Param('commentId', ParseIntPipe) commentId: number): Promise<Comment[]> {
    return this.commentService.findRepliesByComment(commentId);
  }
}
