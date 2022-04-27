
import Env from '@ioc:Adonis/Core/Env'
import Response from 'App/Helpers/Response';
import RandomString from 'App/Services/RandomString'
import Payment from 'App/Repositories/PaymentRepository';
import OrderValidator from 'App/Validators/OrderValidator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OderDetailValidator from 'App/Validators/OderDetailValidator';
import CaptureValidator from 'App/Validators/CaptureValidator';




export default class PaysController {
  public async order({ request,response }: HttpContextContract){
    const apiResponse = new Response(response);
    const paypal = require('@paypal/checkout-server-sdk');
    const clientId = Env.get("PAYPAL_ID")
    const clientSecret =  Env.get("PAYPAL_SECRET")
    // This sample uses SandboxEnvironment. In production, use LiveEnvironment
    const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    const client = new paypal.core.PayPalHttpClient(environment);
    const req = new paypal.orders.OrdersCreateRequest();
    const validated = await request.validate(OrderValidator)
    const value = validated.price*validated.quantity
  //  const value = .5 * quantity
    req.requestBody({
    "intent": "AUTHORIZE",
    "application_context":{
      "user_action":"PAY_NOW",
      "return_url":"https://stg-web.doconchain.io/",// Very important
      "cancel_url":"https://stg-web.doconchain.io/"
  }, 
    'payee':{
      'name':{
          'given_name': 'first name',
          'surname': 'last name',
        },
      'payee_base':{
        'email_address':'email address',
        }, 
        
     
  },
    "purchase_units": [
        {
            "amount": {
                "currency_code": "USD",
                
                "value": value,
                
            }
        }
     ],
    });
  
    let res = await client.execute(req);
   
    
    if(!res){
     return apiResponse.badRequest("something went wrong")
    }
   for (let i = 0; i < res.result.links.length; i++) {
     if(res.result.links[i].rel==="approve"){

      
      const code = RandomString.generate(25, 'alphanumeric');
      await Payment.create({
        'reference_number':code,
        'description': 'Purchase package',
        'amount':value,
        'status': res.result.status,

      })

        return apiResponse.data({id:res.result.id,status:res.result.status,price:.5,quantity:validated.quantity,amount:value,details:"Order Created",redirect:res.result.links[i].href})
       
        
       }
     }   
  }

  public async orderDetail({request, response}:HttpContextContract){
    const apiResponse = new Response(response);
    const paypal = require('@paypal/checkout-server-sdk');
    const clientId = Env.get("PAYPAL_ID")
    const clientSecret =  Env.get("PAYPAL_SECRET")
    const validate = await request.validate(OderDetailValidator)
    const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    const client = new paypal.core.PayPalHttpClient(environment);
    const req = new paypal.orders.OrdersCreateRequest();
    const base64 = require('base-64');
    const basicAuth = base64.encode(`${clientId}:${clientSecret}`);
    const axios = require('axios');
    const details  = await axios({
      method:'get',
      url:`https://api.sandbox.paypal.com/v2/checkout/orders/${validate.orderId}`,
      headers: {'Authorization': `Basic ${basicAuth}`,
      "Content-Type":"application/json",
      }	
      })
      if(!details){
        return apiResponse.badRequest("something went wrong")
      }
    
    return apiResponse.data({Details:details.data})
  }

  public async orderCapture({request, response}:HttpContextContract){
    const apiResponse = new Response(response);
    const paypal = require('@paypal/checkout-server-sdk');
    const clientId = Env.get("PAYPAL_ID")
    const clientSecret =  Env.get("PAYPAL_SECRET")
    const orderId = request.input("orderId")
    const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    const client = new paypal.core.PayPalHttpClient(environment);
    const req = new paypal.orders.OrdersCreateRequest();
    const base64 = require('base-64');
    const basicAuth = base64.encode(`${clientId}:${clientSecret}`);
    const axios = require('axios');
    const details  = await axios({
      method:'get',
      url:`https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
      headers: {'Authorization': `Basic ${basicAuth}`,
      "Content-Type":"application/json",
      }	
      })
      if(!details){
        return apiResponse.badRequest("Not Yet Authorized")
      }
    
    return apiResponse.data({capture:details.data})
  }

  public async captures({request, response}:HttpContextContract){
    const apiResponse = new Response(response);
    const paypal = require('@paypal/checkout-server-sdk');
    const clientId = Env.get("PAYPAL_ID")
    const clientSecret =  Env.get("PAYPAL_SECRET")
    const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    const client = new paypal.core.PayPalHttpClient(environment);
    const req = new paypal.orders.OrdersCreateRequest();
    const validate = await request.validate(CaptureValidator)
    const base64 = require('base-64');
    const basicAuth = base64.encode(`${clientId}:${clientSecret}`);
    const axios = require('axios');
    if(!validate){
      return apiResponse.badRequest("Not Yet Authorized")
    }
    //https://api.sandbox.paypal.com/v2/checkout/orders/
    const payCapture  = await axios({
      method:'post',
      url:`https://api.sandbox.paypal.com/v2/checkout/orders/${validate.orderId}/capture`,
       headers: {'Authorization': `Basic ${basicAuth}`,
       "Content-Type":"application/json"
       }	
      })
      ///v2/payments/authorizations/{authorization_id}/capture
      if(!payCapture){
        return apiResponse.badRequest("Not Yet Authorized")
      }

    return apiResponse.accepted({Capture:payCapture.data})
    


  }

  

  public async listen({request, response}:HttpContextContract){
    const apiResponse = new Response(response);
    const paypal = require('@paypal/checkout-server-sdk');
    const clientId = Env.get("PAYPAL_ID")
    const clientSecret =  Env.get("PAYPAL_SECRET")
    const webhook_id = request.input("webhook_id")
    const axios = require('axios');
    const base64 = require('base-64');
    const basicAuth = base64.encode(`${clientId}:${clientSecret}`);
   
    return  apiResponse.ok("webhook listener")
  }
}

