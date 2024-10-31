import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Cocktail from '#models/cocktail'
import Ingredient from '#models/ingredient'

test.group('Cocktails update', (group) => {
  group.each.teardown(() => testUtils.db().truncate())

  test('success', async ({ client }) => {
    const cocktail = await Cocktail.create({ name: 'Cocktail' })
    const ingredient = await Ingredient.create({ name: 'Ingredient' })

    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = {
      name: 'New Name',
      category: 'Other',
      instructions: 'Instructions',
      ingredients: [{ id: ingredient.id, quantity: 1 }],
    }

    const response = await client.put(`cocktails/${cocktail.id}`).loginAs(admin).json(params)

    response.assertStatus(200)
    response.assertBodyContains({ name: 'New Name' })
    response.assertAgainstApiSpec()
  })

  test('failure cocktail not found', async ({ client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = { name: 'New Name', category: 'Other', instructions: 'Instructions' }

    const response = await client.put('cocktails/1').loginAs(admin).json(params)

    response.assertStatus(404)
    response.assertAgainstApiSpec()
  })

  test('failure mising param', async ({ client }) => {
    const cocktail = await Cocktail.create({ name: 'Cocktail' })

    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = { category: 'Other', instructions: 'Instructions' }

    const response = await client.put(`cocktails/${cocktail.id}`).loginAs(admin).json(params)

    response.assertStatus(422)
    response.assertAgainstApiSpec()
  })

  test('failure invalid ingredient', async ({ client }) => {
    const cocktail = await Cocktail.create({ name: 'Cocktail' })

    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = {
      name: 'Cocktail',
      category: 'Other',
      instructions: 'Instructions',
      ingredients: [1],
    }

    const response = await client.put(`cocktails/${cocktail.id}`).loginAs(admin).json(params)

    response.assertStatus(422)
    response.assertAgainstApiSpec()
  })

  test('failure unauthorized', async ({ client }) => {
    const cocktail = await Cocktail.create({ name: 'Cocktail' })

    const user = await User.create({ email: 'user@user.com', password: 'password' })
    const params = {
      name: 'Cocktail',
      category: 'Other',
      instructions: 'Instructions',
      ingredients: [1],
    }

    const response = await client.put(`cocktails/${cocktail.id}`).loginAs(user).json(params)

    response.assertStatus(403)
    response.assertAgainstApiSpec()
  })

  test('failure unauthenticated', async ({ client }) => {
    const cocktail = await Cocktail.create({ name: 'Cocktail' })

    const params = {
      name: 'Cocktail',
      category: 'Other',
      instructions: 'Instructions',
      ingredients: [1],
    }

    const response = await client.put(`cocktails/${cocktail.id}`).json(params)

    response.assertStatus(401)
    response.assertAgainstApiSpec()
  })
})
