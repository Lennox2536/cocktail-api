/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const SessionController = () => import('#controllers/session_controller')

router.post('login', [SessionController, 'login'])
router.post('register', [SessionController, 'register'])
