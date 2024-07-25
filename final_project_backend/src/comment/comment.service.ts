import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  // 댓글 생성
  async create(commentData: Partial<Comment>): Promise<Comment> {
    const comment = this.commentRepository.create(commentData);
    return this.commentRepository.save(comment);
  }

  // 모든 댓글 조회
  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  // 특정 댓글 조회
  async findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOneBy({ commentId: id });
  }

  // 댓글 업데이트
  async update(id: number, commentData: Partial<Comment>): Promise<void> {
    await this.commentRepository.update(id, commentData);
  }

  // 댓글 삭제
  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
