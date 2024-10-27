import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import PermissionsService from '#services/permissions_service'
import { inject } from '@adonisjs/core'

@inject()
export default class SessionController {
  constructor(protected permissionService: PermissionsService) {}

  async register({ request, response }: HttpContext) {
    try {
      const body = request.body()

      const email = body.email
      const password = body.password

      await User.create({ email: email, password: password })

      return ''
    } catch (error) {
      response.abort({ errors: [{ message: 'Cannot register' }] }, 422)
    }
  }

  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user, this.permissionService.get(user))

    return {
      type: 'bearer',
      value: token.value!.release(),
    }
  }
}
