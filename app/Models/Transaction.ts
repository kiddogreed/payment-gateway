import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public client_id: number

  @column()
  public gateway_code: string

  @column()
  public reference_number: string

  @column()
  public currency: string

  @column()
  public amount: string


  @column()
  public data: string

  @column()
  public gateway_reference_number: string

  @column()
  public gateway_status: string

  @column()
  public status: string


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
