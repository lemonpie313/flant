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

  async createComment(commentData: Partial<Comment>): Promise<Comment> {
    const comment = this.commentRepository.create(commentData);
    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  async findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOneBy({ commentId: id });
  }

  async update(id: number, commentData: Partial<Comment>): Promise<void> {
    await this.commentRepository.update(id, commentData);
  }

  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }

  async findCommentsByPost(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { postId, parentCommentId: null },
      relations: ['childComments'],
    });
  }

  async findRepliesByComment(commentId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { parentCommentId: commentId },
    });
  }
}
