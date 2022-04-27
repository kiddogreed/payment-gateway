import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public api_key: string

  @column()
  public webhook_url: string

  @column()
  public webhook_key: string

  @column()
  public gateways: string

  @column()
  public client_gateways: string

  @column()
  public client_currency: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
