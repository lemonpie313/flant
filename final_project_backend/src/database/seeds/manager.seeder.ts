import { hash } from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../user/types/user-role.type';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
import { Manager } from 'src/admin/entities/manager.entity';
import { Community } from 'src/community/entities/community.entity';
export default class ManagerSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Manager);
    const userRepository = dataSource.getRepository(User);
    const communityRepository = dataSource.getRepository(Community);
    const users = await userRepository.find({
        where: {
            role: UserRole.Manager,
        }
    })
    const community = await communityRepository.find();
    const communityId = community.map((i) => i.communityId);
    const userId = users.map((i) => i.userId);
    const configService = new ConfigService();
    const hashRound = parseInt(configService.get('PASSWORD_HASH'));
  //   await repository.insert([
  //     {
  //       userId: userId[0],
  //       communityId: communityId[0],
  //       managerNickname: 'manager1',
  //     },
  //     {
  //       userId: userId[1],
  //       communityId: communityId[1],
  //       managerNickname: 'manager2',
  //     },
  //   ]);
  }
}
