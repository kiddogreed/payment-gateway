import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TransactionEvent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public transaction_id: string

  @column()
  public event: string

  @column()
  public data: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
