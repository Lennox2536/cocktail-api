import type { HttpContext } from '@adonisjs/core/http'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { createOrUpdateIngredientValidator } from '#validators/ingredients'
import IngredientPolicy from '#policies/ingredient_policy'
import Ingredient from '#models/ingredient'
export default class IngredientsController {
  async index({ request }: HttpContext) {
    const alcohol = request.input('alcohol')

    const ingredients = await Ingredient.query()
      .if(alcohol, (query) => {
        query.where('alcohol', alcohol)
      })
      .paginate(request.input('page', 1), request.input('perPage', 15))

    return this.serialize(ingredients)
  }

  async store({ auth, bouncer, response, request }: HttpContext) {
    await auth.authenticate()

    if (await bouncer.with(IngredientPolicy).denies('create')) {
      return response.forbidden({ errors: [{ message: 'Cannot create a ingredient' }] })
    }

    const payload = await request.validateUsing(createOrUpdateIngredientValidator)

    try {
      const ingredient = await Ingredient.create(payload)

      response.status(201)
      return this.serialize(ingredient)
    } catch (error) {
      response.abort({ errors: [{ message: 'Failure' }] }, 422)
    }
  }

  async update({ auth, bouncer, response, params, request }: HttpContext) {
    await auth.authenticate()

    if (await bouncer.with(IngredientPolicy).denies('update')) {
      return response.forbidden({ errors: [{ message: 'Cannot update a ingredient' }] })
    }

    const ingredient = await Ingredient.findOrFail(params.id)

    const payload = await request.validateUsing(createOrUpdateIngredientValidator)

    try {
      ingredient.merge(payload)

      response.status(200)
      return this.serialize(ingredient)
    } catch (error) {
      response.abort({ errors: [{ message: 'Failure' }] }, 422)
    }
  }

  async destroy({ auth, bouncer, response, params }: HttpContext) {
    await auth.authenticate()

    if (await bouncer.with(IngredientPolicy).denies('destroy')) {
      return response.forbidden({ errors: [{ message: 'Cannot destroy a ingredient' }] })
    }

    const ingredient = await Ingredient.findOrFail(params.id)

    await ingredient.delete()
    response.status(204)
    return ''
  }

  async show({ params }: HttpContext) {
    const ingredient = await Ingredient.findOrFail(params.id)

    return this.serialize(ingredient)
  }

  private serialize(result: Ingredient | ModelPaginatorContract<Ingredient>) {
    return result.serialize({
      fields: {
        pick: ['id', 'name', 'description', 'alcohol', 'imageUrl'],
      },
    })
  }
}
