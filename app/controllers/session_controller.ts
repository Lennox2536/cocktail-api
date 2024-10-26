import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class SessionController {
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

    const token = await User.accessTokens.create(user)

    return {
      type: 'bearer',
      value: token.value!.release(),
    }
  }
}
