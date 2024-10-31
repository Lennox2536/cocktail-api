import vine from '@vinejs/vine'

export const createOrderValidator = vine.compile(
  vine.object({
    cocktails: vine.array(
      vine.object({
        id: vine.number().positive(),
        quantity: vine.number().positive(),
      })
    ),
  })
)
