import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { NoticeImage } from "./notice-image.entity";
import { IsNotEmpty, IsString } from "class-validator";

@Entity('notices')
export class Notice {
    @PrimaryGeneratedColumn({ unsigned: true })
    noticeId: number;

    @Column({ unsigned: true })
    communityId: number;

    @Column({ unsigned: true })
    managerId: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
    
    @OneToMany(() => NoticeImage, (noticeImage) => noticeImage.notice)
    noticeImages: NoticeImage[];
}
