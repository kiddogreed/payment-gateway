import Env from '@ioc:Adonis/Core/Env'
import Response from 'App/Helpers/Response';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import RandomString from 'App/Services/RandomString'
import MultipayValidator from 'App/Validators/MultipayValidator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClientValidator from 'App/Validators/ClientValidator';
import ClientRepository from 'App/Repositories/ClientRepository';
import TransactionRepository from 'App/Repositories/TransactionRepository';
import TransactionEventRepository from 'App/Repositories/TransactionEventRepository';
import ChannelValidator from 'App/Validators/ChannelValidator';

export default class TestsController {
  public async tester({request, response}:HttpContextContract){
    const clientID = 1
    const axios = require('axios');
    const validate = await request.validate(MultipayValidator)
    const txnid = RandomString.generate(20, 'alphanumeric');
    const referenceNo = RandomString.generate(12);
    const token = Env.get(`XMULTIPAYTOKEN`)
    const strAmount = validate.amount.toString()
    const strTxnid = txnid.toString()
    const raw_signature = hmacSHA256(`${strAmount}|MSYS-${strTxnid}`, token);
    const hmacDigest= raw_signature.toString();
    const apiResponse = new Response(response);
    const validateClient = await request.validate(ClientValidator)
    let url = ''
    if(validateClient.gateways=="MULTIPAY"){
      const channel = await request.validate(ChannelValidator)
      if(channel.channel='multipay'){
     
        url = "https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate"
      }
      if(channel.channel='gcash'){
     
        url = "https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_gcash"
      }
      if(channel.channel =='paymayaqr'){
        url= "https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_paymaya_qr"
      }
      if(channel.channel =='unionpayqr'){
        url = "https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_unionpay"
      }
      if(channel.channel =='wechatpayqr'){
        url = "https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_wechatpay"
      }
      if(channel.channel =='alipayqr'){
        url = "https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_alipay"
      }
      if(channel.channel =='grabpayqr'){
        url = "https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_alipay"
      }
      if(channel.channel =='creditcard'){
        url = "https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_card"
      }
      const data = {
        "amount": `${validate.amount}`,
        "txnid": `MSYS-${strTxnid}`,
        "digest": hmacDigest,
        "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"
      }
  
      const config = {
        method:'POST',
        url: url,
        headers: { 
          'X-MultiPay-Token': token, 
          'X-MultiPay-Code': 'MSYS_TEST_BILLER',
          'Content-Type': 'application/json'
        },
        data:data
      }
  
      const details = await axios(config)

      await  ClientRepository.create({
        'api_key': token,
        'webhook_url':"webhook_url",
        'webhook_key':"webhook_key",
        'gateways':validateClient.gateways,
        'client_gateways': validateClient.client_gateways,
        'client_currency':'PHP',
      })
  
      let gatewayURL = details.data.data.url.split('/') 
      await  TransactionRepository.create({
        'client_id':clientID,
        'gateway_code':validateClient.gateways,
        'reference_number':`${validateClient.gateways.substring(0,4)}-${referenceNo}`,
        'currency':'PHP',
        'amount':`${validate.amount}`,
        'data':  `${JSON.stringify(details.data.data)}`,
        'gateway_reference_number': details.data.data.refno,
        'gateway_status':'TEST ENVIRONMENT',
        'status':'CREATED',
      })
      await  TransactionEventRepository.create({
        "transaction_id": referenceNo,
        'event':"PAYMENT INITIATION",
        'data':`${JSON.stringify(details.data.data)}`,
      })
    
        if(!details){
          return apiResponse.badRequest("something went wrong")
        }
    
    return apiResponse.accepted(details.data)
    }
    if(validateClient.gateways=="PAYPAL"){
      const CryptoJS = require('crypto-js');
      const paypal = require('@paypal/checkout-server-sdk');
      const clientId = Env.get("PAYPAL_ID")
      const clientSecret =  Env.get("PAYPAL_SECRET")
      const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
      const client = new paypal.core.PayPalHttpClient(environment);
      const req = new paypal.orders.OrdersCreateRequest();
      const value = validate.amount
      const rawkey =`${clientId}:${clientSecret}`
      const wordArray = CryptoJS.enc.Utf8.parse(rawkey);
      const headertoken = CryptoJS.enc.Base64.stringify(wordArray);
      

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
         const datas = {id:res.result.id,status:res.result.status,amount:value,details:"Order Created",redirect:res.result.links[i].href
        }

        
        await  ClientRepository.create({
          'api_key': `Basic ${headertoken}`,
          'webhook_url':"webhook_url",
          'webhook_key':"webhook_key",
          'gateways':validateClient.gateways,
          'client_gateways': validateClient.client_gateways,
          'client_currency':'USD',
        })
        await  TransactionRepository.create({
          'client_id':clientID,
          'gateway_code':validateClient.gateways,
          'reference_number':`${validateClient.gateways.substring(0,4)}-${referenceNo}`,
          'currency':'USD',
          'amount':`${validate.amount}`,
          'data':  `${JSON.stringify(datas)}`,
          'gateway_reference_number': res.result.id,
          'gateway_status':'TEST ENVIRONMENT',
          'status':res.result.status,
        })
        await  TransactionEventRepository.create({
          "transaction_id": referenceNo,
          'event':"PAYMENT INITIATION",
          'data':`${JSON.stringify(datas)}`,
        })

      return apiResponse.data({
          url:res.result.links[i].href
            })
          }
        }   

    }
    if(validateClient.gateways=="STRIPE"){
     const stripekey = Env.get("STRIPEKEY")
     const stripe = require('stripe')(`${stripekey}`);
     const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1K6s4bGedVQTFauHUsnPkWZj',
          quantity: validate.amount,
        },
      ],
      mode: 'payment',
      success_url: `http://127.0.0.1:3333/paypal/success/paypalpay`,
      cancel_url: `http://127.0.0.1:3333/paypal/cancel/paypalpay`,
    }); 

    await  ClientRepository.create({
      'api_key': `${stripekey}`,
      'webhook_url':"webhook_url",
      'webhook_key':"webhook_key",
      'gateways':validateClient.gateways,
      'client_gateways': validateClient.client_gateways,
      'client_currency':'USD',
    })
    await  TransactionRepository.create({
      'client_id':clientID,
      'gateway_code':validateClient.gateways,
      'reference_number':`${validateClient.gateways.substring(0,4)}-${referenceNo}`,
      'currency':'USD',
      'amount':`${validate.amount}`,
      'data':  `${JSON.stringify(session.url)}`,
      'gateway_reference_number': session.id,
      'gateway_status':'TEST ENVIRONMENT',
      'status':session.payment_status,
    })
    await  TransactionEventRepository.create({
      "transaction_id": referenceNo,
      'event':"PAYMENT INITIATION",
      'data':`${JSON.stringify(session.url)}`,
    })

    
   return apiResponse.data({url:session.url})
    
  
   
    }
    else{
      return apiResponse.badRequest("Invalid gateway!")
    }

    
   
  } 

  
}
