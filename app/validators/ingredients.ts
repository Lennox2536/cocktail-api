import vine from '@vinejs/vine'
/**
 * Validates the ingredient's creation action
 */
export const createOrUpdateIngredientValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(6),
    description: vine.string().trim(),
    alcohol: vine.boolean(),
    image_url: vine.string().trim(),
  })
)
