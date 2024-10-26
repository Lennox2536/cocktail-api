import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Session signing', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should sign up', async ({ client }) => {
    const email = 'some.email@test.com'
    const password = 'password'

    const response = await client.post('/register').json({
      email: email,
      password: password,
    })

    response.assertStatus(204)
  })

  test('should not sign up if email is taken', async ({ client }) => {
    const email = 'some.email@test.com'
    const password = 'password'

    await User.create({ email: email, password: password })

    const response = await client.post('/register').json({
      email: email,
      password: password,
    })

    response.assertStatus(422)
    response.assertAgainstApiSpec()
  })

  test('should sign in and return access token', async ({ client }) => {
    const email = 'some.email@test.com'
    const password = 'password'

    await User.create({ email: email, password: password })

    const response = await client.post('/login').json({
      email: email,
      password: password,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      type: 'bearer',
    })
    response.assertAgainstApiSpec()
  })

  test('should not sign in if credentials are incorrect', async ({ client }) => {
    const email = 'some.email@test.com'
    const password = 'password'

    await User.create({ email: email, password: password })

    const response = await client.post('/login').json({
      email: email,
      password: 'incorrect',
    })

    response.assertStatus(400)
    response.assertAgainstApiSpec()
  })
})
