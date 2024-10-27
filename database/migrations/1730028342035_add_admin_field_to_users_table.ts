import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('users', (table) => {
      table.boolean('admin').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      table.dropColumn('admin')
    })
  }
}
