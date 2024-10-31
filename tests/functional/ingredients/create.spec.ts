import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Ingredients create', (group) => {
  group.each.teardown(() => testUtils.db().truncate())

  test('success', async ({ client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = {
      name: 'Ingredient',
      description: 'Description',
      alcohol: true,
      image_url: 'example.com/image',
    }

    const response = await client.post('ingredients').loginAs(admin).json(params)

    response.assertStatus(201)
    response.assertAgainstApiSpec()
  })

  test('failure mising param', async ({ client }) => {
    const admin = await User.create({ email: 'admin@admin.com', password: 'password', admin: true })
    const params = { description: 'Description', alcohol: true, image_url: 'example.com/image' }

    const response = await client.post('ingredients').loginAs(admin).json(params)

    response.assertStatus(422)
    response.assertAgainstApiSpec()
  })

  test('failure unauthorized', async ({ client }) => {
    const user = await User.create({ email: 'user@user.com', password: 'password' })
    const params = {
      name: 'Ingredient',
      description: 'Description',
      alcohol: true,
      image_url: 'example.com/image',
    }

    const response = await client.post('ingredients').loginAs(user).json(params)

    response.assertStatus(403)
    response.assertAgainstApiSpec()
  })

  test('failure unauthenticated', async ({ client }) => {
    const params = {
      name: 'Ingredient',
      description: 'Description',
      alcohol: true,
      image_url: 'example.com/image',
    }

    const response = await client.post('ingredients').json(params)

    response.assertStatus(401)
    response.assertAgainstApiSpec()
  })
})
