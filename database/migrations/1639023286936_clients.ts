import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clients extends BaseSchema {
  protected tableName = 'clients'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('api_key').nullable()
      table.string('webhook_url').nullable()
      table.string('webhook_key').nullable()
      table.enu('gateways', ['MULTIPAY', 'PAYPAL', 'STRIPE']).nullable()
      table.string('client_gateways').nullable()
      table.string('client_currency').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
