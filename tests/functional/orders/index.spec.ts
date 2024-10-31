import Cocktail from '#models/cocktail'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Order from '#models/order'
import User from '#models/user'
import { DateTime } from 'luxon'

test.group('Orders index', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('success', async ({ client }) => {
    const user = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const cocktail = await Cocktail.create({ name: 'Cocktail' })
    const order = await Order.create({ order_date: DateTime.now() })
    order.related('user').associate(user)
    order.related('cocktails').attach({ [cocktail.id]: { quantity: 1 } })

    const response = await client.get('/cocktails').loginAs(user)

    response.assertStatus(200)
    response.assertAgainstApiSpec()
  })
})
