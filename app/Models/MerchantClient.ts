import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class MerchantClient extends BaseModel {
  @column({ isPrimary: true })
  public id: number


  @column()
  public merchant_id: string

  @column()
  public email: string

  @column()
  public mobile_number: number


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
