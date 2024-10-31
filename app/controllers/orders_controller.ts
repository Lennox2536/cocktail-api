import Order from '#models/order'
import OrderPolicy from '#policies/order_policy'
import { createOrderValidator } from '#validators/order'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { ModelObject, ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export default class OrdersController {
  async index({ auth, request }: HttpContext) {
    const user = await auth.authenticate()

    const orders = await user
      .related('orders')
      .query()
      .preload('cocktails')
      .paginate(request.input('page', 1), request.input('perPage', 15))
    return this.serialize(orders)
  }

  async show({ auth, bouncer, params, response }: HttpContext) {
    await auth.authenticate()

    const order = await Order.query().preload('cocktails').where('id', params.id).firstOrFail()

    if (await bouncer.with(OrderPolicy).denies('show', order)) {
      return response.forbidden({ errors: [{ message: 'Cannot show an order' }] })
    }
    return this.serialize(order)
  }

  async destroy({ auth, bouncer, response, params }: HttpContext) {
    await auth.authenticate()

    const order = await Order.findOrFail(params.id)
    if (await bouncer.with(OrderPolicy).denies('destroy')) {
      return response.forbidden({ errors: [{ message: 'Cannot destroy an order' }] })
    }

    await order.delete()
    response.status(204)
    return ''
  }

  async store({ auth, response, request }: HttpContext) {
    const user = await auth.authenticate()

    const payload = await request.validateUsing(createOrderValidator)

    try {
      const createdCocktail = await db.transaction(async (trx) => {
        const order = await Order.create({ order_date: DateTime.now() })
        order.useTransaction(trx)

        order.related('user').associate(user)

        const result = payload.cocktails.reduce(
          (record, item) => {
            record[item.id] = { quantity: item.quantity }
            return record
          },
          {} as Record<string, ModelObject>
        )

        await order.related('cocktails').attach(result)
        await order.load('cocktails')
        return order
      })

      response.status(201)
      return this.serialize(createdCocktail)
    } catch (error) {
      response.abort({ errors: [{ message: 'Failure' }] }, 422)
    }
  }

  private serialize(result: Order | ModelPaginatorContract<Order>) {
    return result.serialize({
      fields: {
        pick: ['id', 'orderDate'],
      },
      relations: {
        cocktails: {
          fields: ['id', 'name', 'alcoholic'],
        },
      },
    })
  }
}
