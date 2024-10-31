import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'line_item'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('order_id').unsigned().references('orders.id').onDelete('CASCADE')
      table.integer('cocktail_id').unsigned().references('cocktails.id').onDelete('CASCADE')
      table.integer('quantity').notNullable()
      table.unique(['order_id', 'cocktail_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
