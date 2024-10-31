import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Cocktail from '#models/cocktail'
import db from '@adonisjs/lucid/services/db'

test.group('Cocktails destroy', (group) => {
  group.each.teardown(() => testUtils.db().truncate())

  test('success', async ({ assert, client }) => {
    const cocktail = await Cocktail.create({ name: 'Cocktail' })

    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })

    const response = await client.delete(`cocktails/${cocktail.id}`).loginAs(admin)

    response.assertStatus(204)
    const countQuery = await db.from('cocktails').count('* as total')
    assert.equal(countQuery[0].total, 0)
  })

  test('failure cocktail not found', async ({ client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })

    const response = await client.delete('cocktails/1').loginAs(admin)

    response.assertStatus(404)
    response.assertAgainstApiSpec()
  })

  test('failure unauthorized', async ({ client }) => {
    const cocktail = await Cocktail.create({ name: 'Cocktail' })

    const user = await User.create({ email: 'user@user.com', password: 'password' })

    const response = await client.delete(`cocktails/${cocktail.id}`).loginAs(user)

    response.assertStatus(403)
    response.assertAgainstApiSpec()
  })

  test('failure unauthenticated', async ({ client }) => {
    const cocktail = await Cocktail.create({ name: 'Cocktail' })

    const response = await client.delete(`cocktails/${cocktail.id}`)

    response.assertStatus(401)
    response.assertAgainstApiSpec()
  })
})
