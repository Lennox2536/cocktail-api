import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Ingredient from '#models/ingredient'

test.group('Cocktails create', (group) => {
  group.each.teardown(() => testUtils.db().truncate())

  test('success', async ({ client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const ingredient = await Ingredient.create({ name: 'Ingredient' })
    const params = {
      name: 'Cocktail',
      category: 'Other',
      instructions: 'Instructions',
      ingredients: [{ id: ingredient.id, quantity: 1 }],
    }

    const response = await client.post('cocktails').loginAs(admin).json(params)

    response.assertStatus(201)
    response.assertAgainstApiSpec()
  })

  test('failure mising param', async ({ client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = { category: 'Other', instructions: 'Instructions' }

    const response = await client.post('cocktails').loginAs(admin).json(params)

    response.assertStatus(422)
    response.assertAgainstApiSpec()
  })

  test('failure invalid ingredient', async ({ client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = {
      name: 'Cocktail',
      category: 'Other',
      instructions: 'Instructions',
      ingredients: [1],
    }

    const response = await client.post('cocktails').loginAs(admin).json(params)

    response.assertStatus(422)
    response.assertAgainstApiSpec()
  })

  test('failure unauthorized', async ({ client }) => {
    const user = await User.create({ email: 'user@user.com', password: 'password' })
    const params = {
      name: 'Cocktail',
      category: 'Other',
      instructions: 'Instructions',
      ingredients: [1],
    }

    const response = await client.post('cocktails').loginAs(user).json(params)

    response.assertStatus(403)
    response.assertAgainstApiSpec()
  })

  test('failure unauthenticated', async ({ client }) => {
    const params = {
      name: 'Cocktail',
      category: 'Other',
      instructions: 'Instructions',
      ingredients: [1],
    }

    const response = await client.post('cocktails').json(params)

    response.assertStatus(401)
    response.assertAgainstApiSpec()
  })
})
