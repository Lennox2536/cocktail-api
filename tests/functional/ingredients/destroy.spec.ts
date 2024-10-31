import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Ingredient from '#models/ingredient'
import db from '@adonisjs/lucid/services/db'

test.group('Ingredients destroy', (group) => {
  group.each.teardown(() => testUtils.db().truncate())

  test('success', async ({ assert, client }) => {
    const ingredient = await Ingredient.create({ name: 'Ingredient' })

    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })

    const response = await client.delete(`ingredients/${ingredient.id}`).loginAs(admin)

    response.assertStatus(204)
    const countQuery = await db.from('ingredients').count('* as total')
    assert.equal(countQuery[0].total, 0)
  })

  test('failure ingredient not found', async ({ client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })

    const response = await client.delete('ingredients/1').loginAs(admin)

    response.assertStatus(404)
    response.assertAgainstApiSpec()
  })

  test('failure unauthorized', async ({ client }) => {
    const ingredient = await Ingredient.create({ name: 'Ingredient' })

    const user = await User.create({ email: 'user@user.com', password: 'password' })

    const response = await client.delete(`ingredients/${ingredient.id}`).loginAs(user)

    response.assertStatus(403)
    response.assertAgainstApiSpec()
  })

  test('failure unauthenticated', async ({ client }) => {
    const ingredient = await Ingredient.create({ name: 'Ingredient' })

    const response = await client.delete(`ingredients/${ingredient.id}`)

    response.assertStatus(401)
    response.assertAgainstApiSpec()
  })
})
