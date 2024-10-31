import Ingredient from '#models/ingredient'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Ingredients index', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('example test', async ({ client }) => {
    await Ingredient.create({ name: 'Ingredient' })

    const response = await client.get('/ingredients')

    response.assertStatus(200)
    response.assertBodyContains({ data: [{ name: 'Ingredient' }] })
    response.assertAgainstApiSpec()
  })
})
