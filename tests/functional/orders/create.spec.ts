import Cocktail from '#models/cocktail'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Orders create', (group) => {
  group.each.teardown(() => testUtils.db().truncate())

  test('success', async ({ client }) => {
    const user = await User.create({ email: 'user@user.com', password: 'password' })
    const cocktail = await Cocktail.create({ name: 'Cocktail' })
    const params = {
      cocktails: [{ id: cocktail.id, quantity: 1 }],
    }

    const response = await client.post('orders').loginAs(user).json(params)

    response.assertStatus(201)
    response.assertBodyContains({
      cocktails: [{ id: cocktail.id, name: cocktail.name }],
    })
    response.assertAgainstApiSpec()
  })

  test('failure mising param', async ({ client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = {}
    const response = await client.post('orders').loginAs(admin).json(params)

    response.assertStatus(422)
    response.assertAgainstApiSpec()
  })

  test('failure unauthenticated', async ({ client }) => {
    const params = {}

    const response = await client.post('orders').json(params)

    response.assertStatus(401)
    response.assertAgainstApiSpec()
  })
})
