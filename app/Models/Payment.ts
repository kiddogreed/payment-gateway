import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public payment_event_id: number

  @column()
  public client_id: number

  @column()
  public reference_number: string

  @column()
  public description: string

  @column()
  public payment_method: string

  @column()
  public receipt_url: string

  @column()
  public amount: number

  @column()
  public status: string

  @column()
  public charged_at: DateTime


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
