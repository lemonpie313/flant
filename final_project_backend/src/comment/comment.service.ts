import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,  // Comment 엔티티에 대한 Repository 주입
  ) {}

  /**
   * 새로운 댓글을 생성합니다.
   * @param commentData - 생성할 댓글의 데이터
   * @returns 생성된 댓글
   */
  async createComment(commentData: Partial<Comment>): Promise<Comment> {
    const comment = this.commentRepository.create(commentData);  // 댓글 엔티티 인스턴스 생성
    return this.commentRepository.save(comment);  // 댓글을 데이터베이스에 저장
  }

  /**
   * 모든 댓글을 조회합니다.
   * @returns 댓글 배열
   */
  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find();  // 데이터베이스에서 모든 댓글 조회
  }

  /**
   * 주어진 ID로 댓글을 조회합니다.
   * @param id - 조회할 댓글의 ID
   * @returns 조회된 댓글
   */
  async findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOne({ where: { commentId: id } });  // ID로 댓글 조회
  }

  /**
   * 주어진 ID의 댓글을 업데이트합니다. 
   * @param id - 업데이트할 댓글의 ID
   * @param commentData - 업데이트할 데이터
   */
  async update(id: number, commentData: Partial<Comment>): Promise<void> {
    await this.commentRepository.update(id, commentData);  // ID로 댓글을 찾아 업데이트
  }

  /**
   * 주어진 ID의 댓글을 삭제합니다.
   * @param id - 삭제할 댓글의 ID
   */
  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);  // ID로 댓글을 삭제
  }

  /**
   * 특정 게시물에 대한 댓글을 조회합니다.
   * @param postId - 게시물의 ID
   * @returns 해당 게시물의 댓글 배열
   */
  async findCommentsByPost(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { postId } });  // 게시물 ID로 댓글 조회
  }

  /**
   * 특정 댓글에 대한 대댓글을 조회합니다.
   * @param commentId - 대댓글을 조회할 부모 댓글의 ID
   * @returns 해당 댓글에 대한 대댓글 배열
   */
  async findRepliesByComment(commentId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { postId: commentId } });  // 부모 댓글 ID로 대댓글 조회
  }
}
