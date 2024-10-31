import Ingredient from './ingredient.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { BaseModel, column, computed, manyToMany } from '@adonisjs/lucid/orm'
import { Category } from './cocktail/category.js'

export default class Cocktail extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare category: Category

  @column()
  declare instructions: string | null

  @computed()
  get alcoholic() {
    return this.ingredients?.some((ingredient) => ingredient.alcohol) ?? false
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Ingredient, {
    pivotColumns: ['quantity'],
  })
  declare ingredients: ManyToMany<typeof Ingredient>
}
