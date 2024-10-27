import PermissionsService, {
  adminPermissions,
  userPermissions,
} from '#services/permissions_service'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Permissions service get', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should return admin permissions', async ({ assert }) => {
    const permissionsService = new PermissionsService()

    const email = 'some.email@test.com'
    const password = 'password'

    const admin = await User.create({ email: email, password: password, admin: true })

    assert.equal(permissionsService.get(admin), adminPermissions)
  })

  test('should return user permissions', async ({ assert }) => {
    const permissionsService = new PermissionsService()

    const email = 'some.email@test.com'
    const password = 'password'

    const user = await User.create({ email: email, password: password })

    assert.equal(permissionsService.get(user), userPermissions)
  })
})
