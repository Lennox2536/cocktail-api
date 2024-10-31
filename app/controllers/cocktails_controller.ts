import Cocktail from '#models/cocktail'
import type { HttpContext } from '@adonisjs/core/http'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import {
  createOrUpdateCocktailValidator,
  createOrUpdateCocktailIngredientsValidator,
} from '#validators/cocktail'
import db from '@adonisjs/lucid/services/db'
import CocktailPolicy from '#policies/cocktail_policy'
import { ModelObject } from '@adonisjs/lucid/types/model'

export default class CocktailsController {
  async index({ request }: HttpContext) {
    const alcoholic = request.input('alcoholic')

    const cocktails = await Cocktail.query()
      .preload('ingredients')
      .if(alcoholic, (query) => {
        query.whereHas('ingredients', (ingredients_query) =>
          ingredients_query.where('alcohol', alcoholic)
        )
      })
      .paginate(request.input('page', 1), request.input('perPage', 15))

    return this.serialize(cocktails)
  }

  async store({ auth, bouncer, response, request }: HttpContext) {
    await auth.authenticate()

    if (await bouncer.with(CocktailPolicy).denies('create')) {
      return response.forbidden({ errors: [{ message: 'Cannot create a cocktail' }] })
    }

    const cocktailPayload = await request.validateUsing(createOrUpdateCocktailValidator)
    const ingredientsPayload = await request.validateUsing(
      createOrUpdateCocktailIngredientsValidator
    )

    try {
      const createdCocktail = await db.transaction(async (trx) => {
        const cocktail = new Cocktail()
        cocktail.merge(cocktailPayload)

        cocktail.useTransaction(trx)
        await cocktail.save()

        const result = ingredientsPayload.ingredients.reduce(
          (record, item) => {
            record[item.id] = { quantity: item.quantity }
            return record
          },
          {} as Record<string, ModelObject>
        )

        await cocktail.related('ingredients').attach(result)
        await cocktail.load('ingredients')
        return cocktail
      })

      response.status(201)
      return this.serialize(createdCocktail)
    } catch (error) {
      response.abort({ errors: [{ message: 'Failure' }] }, 422)
    }
  }

  async update({ auth, bouncer, response, params, request }: HttpContext) {
    await auth.authenticate()

    if (await bouncer.with(CocktailPolicy).denies('update')) {
      return response.forbidden({ errors: [{ message: 'Cannot update a cocktail' }] })
    }

    const cocktail = await Cocktail.query()
      .preload('ingredients')
      .where('id', params.id)
      .firstOrFail()

    const cocktailPayload = await request.validateUsing(createOrUpdateCocktailValidator)
    const ingredientsPayload = await request.validateUsing(
      createOrUpdateCocktailIngredientsValidator
    )

    try {
      await db.transaction(async (trx) => {
        cocktail.merge(cocktailPayload)

        cocktail.useTransaction(trx)
        await cocktail.save()

        await cocktail.related('ingredients').detach()

        const result = ingredientsPayload.ingredients.reduce(
          (record, item) => {
            record[item.id] = { quantity: item.quantity }
            return record
          },
          {} as Record<string, ModelObject>
        )
        await cocktail.related('ingredients').attach(result)
        await cocktail.load('ingredients')

        return cocktail
      })

      response.status(200)
      return this.serialize(cocktail)
    } catch (error) {
      response.abort({ errors: [{ message: 'Failure' }] }, 422)
    }
  }

  async destroy({ auth, bouncer, response, params }: HttpContext) {
    await auth.authenticate()

    if (await bouncer.with(CocktailPolicy).denies('destroy')) {
      return response.forbidden({ errors: [{ message: 'Cannot destroy a cocktail' }] })
    }

    const cocktail = await Cocktail.findOrFail(params.id)
    await cocktail.delete()
    response.status(204)
    return ''
  }

  async show({ params }: HttpContext) {
    const cocktail = await Cocktail.query()
      .preload('ingredients')
      .where('id', params.id)
      .firstOrFail()

    return this.serialize(cocktail)
  }

  private serialize(result: Cocktail | ModelPaginatorContract<Cocktail>) {
    return result.serialize({
      fields: {
        pick: ['id', 'name', 'category', 'instructions', 'alcoholic'],
      },
      relations: {
        ingredients: {
          fields: ['id', 'name'],
        },
      },
    })
  }
}
