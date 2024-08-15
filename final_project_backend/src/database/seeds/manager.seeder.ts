import { hash } from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../user/types/user-role.type';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
export default class ManagerSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);
    const configService = new ConfigService();
    const hashRound = parseInt(configService.get('PASSWORD_HASH'));
    await repository.insert([
      {
        name: 'manager1',
        email: 'manager1@example.com',
        password: await hash(configService.get('ADMIN_PASSWORD'), hashRound),
        role: UserRole.Manager,
        profileImage: 'sparta.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        name: 'manager2',
        email: 'manager2@example.com',
        password: await hash(configService.get('ADMIN_PASSWORD'), hashRound),
        role: UserRole.Manager,
        profileImage: 'sparta.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);
  }
}
