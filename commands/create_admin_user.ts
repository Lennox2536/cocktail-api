import User from '#models/user'
import env from '#start/env'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class CreateAdminUser extends BaseCommand {
  static commandName = 'create:admin-user'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    await User.firstOrCreate(
      {
        email: env.get('ADMIN_EMAIL'),
        admin: true,
      },
      { password: env.get('ADMIN_PASSWORD') }
    )
  }
}
