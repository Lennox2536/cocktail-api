import Order from '#models/order'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class OrderPolicy extends BasePolicy {
  show(user: User, order: Order): AuthorizerResponse {
    return user.admin || user.id === order.userId
  }

  destroy(user: User): AuthorizerResponse {
    return user.admin
  }
}
