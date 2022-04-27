import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('client_id').nullable()
      table.string('gateway_code').nullable()
      table.string('reference_number').nullable()
      table.string('currency').nullable()
      table.string('amount').nullable()
      table.text('data').nullable()
      table.string('gateway_reference_number').nullable()
      table.string('gateway_status').nullable()
      table.string('status').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
