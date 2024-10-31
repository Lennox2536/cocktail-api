import vine from '@vinejs/vine'
import { Category } from '#models/cocktail/category'
/**
 * Validates the cocktail's creation action
 */
export const createOrUpdateCocktailValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(6),
    category: vine.enum(Category),
    instructions: vine.string().trim(),
  })
)

export const createOrUpdateCocktailIngredientsValidator = vine.compile(
  vine.object({
    ingredients: vine.array(
      vine.object({
        id: vine.number().positive(),
        quantity: vine.number().positive(),
      })
    ),
  })
)
