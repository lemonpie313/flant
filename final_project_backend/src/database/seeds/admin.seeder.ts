import { hash } from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../user/types/user-role.type';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class AdminSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);
    await repository.insert([
      {
        name: 'admin',
        email: 'admin',
        password: await hash('admin', 10),
        role: UserRole.Admin,
        profile_image: 'sparta.png',
        createdAt: '2024-07-22 11:02:47.814746',
        updatedAt: '2024-07-22 11:02:47.814746',
        deletedAt: null,
      },
    ]);
  }
}
