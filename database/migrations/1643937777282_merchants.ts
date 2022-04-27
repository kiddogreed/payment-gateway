import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Merchants extends BaseSchema {
  protected tableName = 'merchants'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {

      table.increments('id')
      table.enu('name', ['DOC', 'THE_FAMOUS']).nullable()
      table.string('code').nullable()
      table.string('api_key').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
