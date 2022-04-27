 import Env from '@ioc:Adonis/Core/Env'
 import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WebhooktestsController {
  
  public async webtest({request, response}:HttpContextContract){
    const paypal = require('@paypal/checkout-server-sdk');
    const clientId = Env.get("PAYPAL_ID")
    const clientSecret =  Env.get("PAYPAL_SECRET")
    const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);

    const PAYPAL_OAUTH_API = 'https://api-m.sandbox.paypal.com/v1/oauth2/token/';
    const PAYPAL_AUTHORIZATION_API = 'https://api-m.sandbox.paypal.com/v2/payments/authorizations/';
    const base64 = require('base-64');
    const basicAuth = base64.encode(`${ clientId }:${ clientSecret }`);
    // AuthorizationsCaptureRequest: [class AuthorizationsCaptureRequest],
    // AuthorizationsGetRequest: [class AuthorizationsGetRequest],
    // AuthorizationsReauthorizeRequest: [class AuthorizationsReauthorizeRequest],
    // AuthorizationsVoidRequest: [class AuthorizationsVoidRequest],
    // CapturesGetRequest: [class CapturesGetRequest],
    // CapturesRefundRequest: [class CapturesRefundRequest],
    // RefundsGetRequest: [class RefundsGetRequest]


    //const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    //const client = new paypal.core.PayPalHttpClient(environment);
    // const req = new paypal.orders.OrdersCreateRequest();
    // let auth = new paypal.payments.AuthorizationsCaptureRequest()
  //  auth.body({
  //   "amount": {
  //     "value": "10.99",
  //     "currency_code": "USD"
  //   },
  //  })
  // auth.requestBody({
   
   
  //         "amount": {
  //             "value": 0.5,
  //             "currency_code": "USD",
            
  //             "invoice_id": "INVOICE-123",
  //             "final_capture": true,
  //             "note_to_payer": "notes"
  //         }
      
   
  // })
     // console.log(auth);
      
      // let res = await client.execute(auth);
      // if(!res){
      //   return response.badRequest("something went wrong")
      //  }
      // for (let i = 0; i < res.result.links.length; i++) {
      //   if(res.result.links[i].rel==="approve"){
      //    console.log(res);
      //      return response.ok({id:res.result.id,status:res.result.status,item:"item",price:.5,details:"Payment Created",redirect:res.result.links[i].href})
      //console.log(res);
      


       
    

    // const webhooklistener  = await axios({
    //   method:'get',
    //   url:`https://api.sandbox.paypal.com/v1/notifications/webhooks/${webhook_id}`,
    //    headers: {'Authorization': `Basic QVdueHdodHdvQmJFSVBYVEx5R2ZXdWltS29USnJ6aldPN2tUUFFTTEs3M0x1TkUyM29BMjlzRGZFVHpEb3RPQ1BWUE5WYl9BdGpZdVFFZGk6RU8zd2Y3QkZSQVY1aENJWnNEa2dKcHRkWS1mcFRVVERRcTNZNzgybGdzUWllSmRadnAyZkFBc0taNmNKTW5YN0luTU9LZHFYc1o0R2tZZXU=`,
    //    "Content-Type":"application/json"
    //    }	
    //   })

  
    
    //   return response.ok({data:webhooklistener.data})


        
  }

  public async pay({request, response}:HttpContextContract){
    const paypal = require('@paypal/checkout-server-sdk');
    const clientId = Env.get("PAYPAL_ID")
    const clientSecret =  Env.get("PAYPAL_SECRET")
    const axios = require('axios');
   // const authorization_id = "2D332929RV0652808"//request.input('authorization_id')
    const base64 = require('base-64');
    const basicAuth = base64.encode(`${clientId}:${clientSecret}`);
    const payment = await axios({
      method :'get',
      url:`https://api.sandbox.paypal.com/v2/payments/authorizations/6PA38984EF477512B`, 
      headers: {'Authorization': `Basic ${basicAuth}`,
      "Content-Type":"application/json"}
    })


    
          
  }
}
