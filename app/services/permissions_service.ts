import User from '#models/user'

export default class PermissionsService {
  get(user: User): string[] {
    return user.admin ? adminPermissions : userPermissions
  }
}

export const adminPermissions = [
  'cocktails:create',
  'cocktails:update',
  'cocktails:delete',
  'ingredients:create',
  'ingredients:update',
  'ingredients:delete',
]

export const userPermissions = []
