import Cocktail from '#models/cocktail'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Cocktails show', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should return a cocktail', async ({ client }) => {
    const cocktail = await Cocktail.create({ name: 'Cocktail' })

    const response = await client.get(`/cocktails/${cocktail.id}`)

    response.assertStatus(200)
    response.assertBodyContains({ name: 'Cocktail' })
    response.assertAgainstApiSpec()
  })

  test('should return not found error', async ({ client }) => {
    const response = await client.get(`/cocktails/1`)

    response.assertStatus(404)
    response.assertAgainstApiSpec()
  })
})
