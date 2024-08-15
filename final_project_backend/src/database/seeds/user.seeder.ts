import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { User } from '../../user/entities/user.entity'

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const Factory = factoryManager.get(User)
    for (let i = 0; i < 20; i++) {
      try {
        await Factory.save({})
      } catch (e) {
        i--
        continue
      }
    }
  }
}