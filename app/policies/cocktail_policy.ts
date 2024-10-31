import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class CocktailPolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    return user.admin
  }

  update(user: User): AuthorizerResponse {
    return user.admin
  }

  destroy(user: User): AuthorizerResponse {
    return user.admin
  }
}
