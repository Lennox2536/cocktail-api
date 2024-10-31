import Ingredient from '#models/ingredient'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Ingredients show', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should return an ingredient', async ({ client }) => {
    const ingredient = await Ingredient.create({ name: 'Ingredient' })

    const response = await client.get(`/ingredients/${ingredient.id}`)

    response.assertStatus(200)
    response.assertBodyContains({ name: 'Ingredient' })
    response.assertAgainstApiSpec()
  })

  test('should return not found error', async ({ client }) => {
    const response = await client.get(`/ingredients/1`)

    response.assertStatus(404)
    response.assertAgainstApiSpec()
  })
})
