import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Cocktail from '#models/cocktail'
import Order from '#models/order'
import { DateTime } from 'luxon'

test.group('Orders show', (group) => {
  group.each.teardown(() => testUtils.db().truncate())

  test('success', async ({ client }) => {
    const user = await User.create({ email: 'user@user.com', password: 'password' })
    const cocktail = await Cocktail.create({ name: 'Cocktail' })
    const order = await Order.create({ order_date: DateTime.now() })
    order.related('user').associate(user)
    order.related('cocktails').attach({ [cocktail.id]: { quantity: 1 } })

    const response = await client.get(`orders/${order.id}`).loginAs(user)

    response.assertStatus(200)
    response.assertAgainstApiSpec()
  })

  test('failure cocktail not found', async ({ client }) => {
    const user = await User.create({ email: 'user@user.com', password: 'password' })

    const response = await client.get('orders/1').loginAs(user)

    response.assertStatus(404)
    response.assertAgainstApiSpec()
  })

  test('failure unauthorized', async ({ client }) => {
    const user = await User.create({ email: 'user@user.com', password: 'password' })
    const cocktail = await Cocktail.create({ name: 'Cocktail' })
    const order = await Order.create({ order_date: DateTime.now() })
    order.related('cocktails').attach({ [cocktail.id]: { quantity: 1 } })

    const response = await client.get(`orders/${order.id}`).loginAs(user)

    response.assertStatus(403)
    response.assertAgainstApiSpec()
  })

  test('failure unauthenticated', async ({ client }) => {
    const response = await client.get('orders/1')

    response.assertStatus(401)
    response.assertAgainstApiSpec()
  })
})
