import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'


Route.get('/', async () => {
  return { message: `DOC PAY API(${Env.get('NODE_ENV')})` }
})
Route.get('paypal/success/paypalpay', async () => {
  return { transaction: 'successful transaction' }
})
Route.get('/payment/success', async () => {
  return { transaction: 'successful transaction' }
})
Route.get('paypal/cancel/paypalpay', async () => {
  return { transaction: 'cancelled transaction' }
})
Route.get('payment/cancel', async () => {
  return { transaction: 'cancelled transaction' }
})


Route.post('gateway','PaymentgatewaysController.addGateway')
Route.post('pay','PaysController.pay')
Route.post("stripe/webhooks",'WebhooksController.stripe')
Route.post("paypal/webhooks",'WebhooksController.paypal')
Route.post("multipay/webhooks",'WebhooksController.multipay')


Route.get('paypal/details','PaypalController.orderDetail')
Route.post('paypal/order','PaypalController.order')
Route.post('paypal/capture','PaypalController.captures')
Route.get('/multipay/transaction','MultipaysController.search')



