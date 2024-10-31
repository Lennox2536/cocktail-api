import { Category } from '#models/cocktail/category'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cocktails'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table
        .enum('category', Object.values(Category), {
          useNative: true,
          enumName: 'category',
        })
        .defaultTo(Category.Other)
      table.string('instructions').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "category"')
  }
}
