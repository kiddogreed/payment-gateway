import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MerchantClients extends BaseSchema {
  protected tableName = 'merchant_clients'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('merchant_id').nullable()
      table.string('email').nullable()
      table.string('mobile_number').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
