import Cocktail from '#models/cocktail'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Cocktails index', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('success', async ({ client }) => {
    await Cocktail.create({ name: 'Cocktail' })

    const response = await client.get('/cocktails')

    response.assertStatus(200)
    response.assertBodyContains({ data: [{ name: 'Cocktail' }] })
    response.assertAgainstApiSpec()
  })
})
