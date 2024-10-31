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
const CocktailsController = () => import('#controllers/cocktails_controller')
const IngredientsController = () => import('#controllers/ingredients_controller')

router.post('login', [SessionController, 'login'])
router.post('register', [SessionController, 'register'])

router.resource('cocktails', CocktailsController).apiOnly()
router.resource('ingredients', IngredientsController).apiOnly()
