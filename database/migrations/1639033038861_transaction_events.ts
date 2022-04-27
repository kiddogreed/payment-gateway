import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TransactionEvents extends BaseSchema {
  protected tableName = 'transaction_events'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('transaction_id').nullable()
      table.string('event').nullable()
      table.text('data').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
