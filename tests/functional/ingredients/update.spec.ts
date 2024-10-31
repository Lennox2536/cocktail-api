import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Ingredient from '#models/ingredient'

test.group('Ingredients update', (group) => {
  group.each.teardown(() => testUtils.db().truncate())

  test('success', async ({ client }) => {
    const ingredient = await Ingredient.create({ name: 'Ingredient' })

    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = {
      name: 'New Name',
      description: 'Description',
      alcohol: true,
      image_url: 'image',
    }

    const response = await client.put(`ingredients/${ingredient.id}`).loginAs(admin).json(params)

    response.assertStatus(200)
    response.assertBodyContains({ name: 'New Name' })
    response.assertAgainstApiSpec()
  })

  test('failure ingredient not found', async ({ client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = {
      name: 'New Name',
      description: 'Description',
      alcohol: true,
      image_url: 'image',
    }

    const response = await client.put('ingredients/1').loginAs(admin).json(params)

    response.assertStatus(404)
    response.assertAgainstApiSpec()
  })

  test('failure mising param', async ({ client }) => {
    const ingredient = await Ingredient.create({ name: 'Ingredient' })

    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = { description: 'Description', alcohol: true, image_url: 'image' }

    const response = await client.put(`ingredients/${ingredient.id}`).loginAs(admin).json(params)

    response.assertStatus(422)
    response.assertAgainstApiSpec()
  })

  test('failure unauthorized', async ({ client }) => {
    const ingredient = await Ingredient.create({ name: 'Ingredient' })

    const user = await User.create({ email: 'user@user.com', password: 'password' })
    const params = {
      name: 'New Name',
      description: 'Description',
      alcohol: true,
      image_url: 'image',
    }

    const response = await client.put(`ingredients/${ingredient.id}`).loginAs(user).json(params)

    response.assertStatus(403)
    response.assertAgainstApiSpec()
  })

  test('failure unauthenticated', async ({ client }) => {
    const ingredient = await Ingredient.create({ name: 'Ingredient' })

    const params = {
      name: 'New Name',
      description: 'Description',
      alcohol: true,
      image_url: 'image',
    }

    const response = await client.put(`ingredients/${ingredient.id}`).json(params)

    response.assertStatus(401)
    response.assertAgainstApiSpec()
  })
})
