import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Cocktail from '#models/cocktail'
import db from '@adonisjs/lucid/services/db'
import Order from '#models/order'
import { DateTime } from 'luxon'

test.group('Orders destroy', (group) => {
  group.each.teardown(() => testUtils.db().truncate())

  test('success', async ({ assert, client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const cocktail = await Cocktail.create({ name: 'Cocktail' })
    const order = await Order.create({ order_date: DateTime.now() })
    order.related('user').associate(admin)
    order.related('cocktails').attach({ [cocktail.id]: { quantity: 1 } })

    const response = await client.delete(`orders/${order.id}`).loginAs(admin)

    response.assertStatus(204)
    const countQuery = await db.from('orders').count('* as total')
    assert.equal(countQuery[0].total, 0)
  })

  test('failure cocktail not found', async ({ client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })

    const response = await client.delete('orders/1').loginAs(admin)

    response.assertStatus(404)
    response.assertAgainstApiSpec()
  })

  test('failure unauthorized', async ({ client }) => {
    const user = await User.create({ email: 'user@user.com', password: 'password' })
    const cocktail = await Cocktail.create({ name: 'Cocktail' })
    const order = await Order.create({ order_date: DateTime.now() })
    order.related('user').associate(user)
    order.related('cocktails').attach({ [cocktail.id]: { quantity: 1 } })

    const response = await client.delete(`orders/${order.id}`).loginAs(user)

    response.assertStatus(403)
    response.assertAgainstApiSpec()
  })

  test('failure unauthenticated', async ({ client }) => {
    const response = await client.delete('orders/1')

    response.assertStatus(401)
    response.assertAgainstApiSpec()
  })
})
