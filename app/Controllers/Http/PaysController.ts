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
import ApikeyValidator from 'App/Validators/ApikeyValidator';


export default class PaysController {
  public async pay({request, response}:HttpContextContract){
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
    const docKey = await request.validate(ApikeyValidator)
    
    if(docKey.apikey != Env.get(`DOC_PAY_API_KEY`)){
       
        
        return apiResponse.badRequest("Invalid key")
    }

    if(validateClient.gateways=="MULTIPAY"){
       let url = ''
      const channel = await request.validate(ChannelValidator)
      if(channel.channel=='multipay'){
     
        url = "https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate"
      }
  
      
      if(channel.channel=='gcash'){
     
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
        'api_key': docKey.apikey,
        'webhook_url':"webhook_url",
        'webhook_key':"webhook_key",
        'gateways':validateClient.gateways,
        'client_gateways': validateClient.client_gateways,
        'client_currency':'PHP',
      })
      //let gatewayURL = details.data.data.url.split('/') 
      let gatewayURL = details.data.data
      if(channel.channel=='multipay'){
          gatewayURL = gatewayURL.url.split('/')
          gatewayURL = gatewayURL[3]
      }
      if(channel.channel=='paymayaqr'){
          gatewayURL = gatewayURL.url.split('/')
          gatewayURL = gatewayURL[4]
          gatewayURL = gatewayURL.split('=')
          gatewayURL = gatewayURL[1]
      }
      if(channel.channel=='unionpayqr'){
        gatewayURL = gatewayURL.refno
      }
      if(channel.channel=='wechatpayqr'){
        gatewayURL = gatewayURL.refno
      }
      if(channel.channel=='alipayqr'){
        gatewayURL = gatewayURL.refno
      }
      if(channel.channel=='grabpayqr'){
        gatewayURL = gatewayURL.refno
      }
      if(channel.channel=='creditcard'){
        gatewayURL = gatewayURL.url.split('/')
        gatewayURL = gatewayURL[4]
      }
      
      
      await  TransactionRepository.create({
        'client_id':clientID,
        'gateway_code':validateClient.gateways,
        'reference_number':`${validateClient.gateways.substring(0,4)}-${referenceNo}`,
        'currency':'PHP',
        'amount':`${validate.amount}`,
        'data':  `${JSON.stringify(details.data.data)}`,
        'gateway_reference_number': `${gatewayURL}`,
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
        "intent": "CAPTURE",
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
       console.log(res);
       
      if(!res){
        return apiResponse.badRequest("something went wrong")
      }
      for (let i = 0; i < res.result.links.length; i++) {
        if(res.result.links[i].rel==="approve"){

         const code = RandomString.generate(25, 'alphanumeric');
         const datas = {id:res.result.id,status:res.result.status,amount:value,details:"Order Created",redirect:res.result.links[i].href
        }

        
        await  ClientRepository.create({
          'api_key': docKey.apikey,
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
     const endpointSecret = Env.get("STRIPE_ENDPOINT_KEY")
     const webhookURL = Env.get("STRIPE_WEBHOOK_URL")
     const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1KNWv0GedVQTFauHMBcu3BMx', 
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://127.0.0.1:3333/paypal/success/paypalpay`,
      cancel_url: `http://127.0.0.1:3333/paypal/cancel/paypalpay`,
    }); 

    await  ClientRepository.create({
      'api_key': docKey.apikey,
      'webhook_url':`${webhookURL}/stripe/webhooks`,
      'webhook_key':`${endpointSecret}`,
      'gateways':validateClient.gateways,
      'client_gateways': validateClient.client_gateways,
      'client_currency':'USD',
    })
    await  TransactionRepository.create({
      'client_id':clientID,
      'gateway_code':validateClient.gateways,
      'reference_number':`${validateClient.gateways.substring(0,4)}-${referenceNo}`,
      'currency':'USD',
      'amount':`0`,
      'data':  `${JSON.stringify(session.url)}`,
      'gateway_reference_number': session.id,
      'gateway_status':'TEST ENVIRONMENT',
      'status':session.payment_status.toUpperCase(),
    })
    await  TransactionEventRepository.create({
      "transaction_id": referenceNo,
      'event':"SUBSCRIPTION INITIATION",
      'data':`${JSON.stringify(session.url)}`,
    })

   
   
   return apiResponse.data({url:session.url})
    
  
   
    }
    else{
      return apiResponse.badRequest("Invalid gateway!")
    }

    
   
  }
  public async paypalpay({request, response}:HttpContextContract){
    const clientID = 1
    const axios = require('axios');
    const validate = await request.validate(MultipayValidator)
    const referenceNo = RandomString.generate(12);
    
   
    const validateClient = await request.validate(ClientValidator)
    const docKey = await request.validate(ApikeyValidator)

      const paypal = require('@paypal/checkout-server-sdk');
      const clientId = Env.get("PAYPAL_ID")
      const clientSecret =  Env.get("PAYPAL_SECRET")
      const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
      const client = new paypal.core.PayPalHttpClient(environment);
      const req = new paypal.orders.OrdersCreateRequest();
      const value = validate.amount

      
      const baseurl = `https://api.sandbox.paypal.com/v2`
      const base64 = require('base-64');
      const basicAuth = base64.encode(`${clientId}:${clientSecret}`);
      
      const payCapture  = await axios({
        method:'post',
        url:`${baseurl}/payments/authorizations/{authorization_id}`,
         headers: {'Authorization': `Basic ${basicAuth}`,
         "Content-Type":"application/json"
         }	
        })
        ///v2/
        console.log(payCapture);
        
  }

  public async stripepay({request, response}:HttpContextContract){

    const clientID = 1
    const axios = require('axios');
    const apiResponse = new Response(response);
  //  const docKey = await request.validate(ApikeyValidator)
    
    const stripekey = Env.get("STRIPEKEY")
    const stripe = require('stripe')(`${stripekey}`);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1KNWv0GedVQTFauHMBcu3BMx',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://127.0.0.1:50672/paypal/success/paypalpay`,
      cancel_url: `http://127.0.0.1:50672/paypal/cancel/paypalpay`,
    }); 
    console.log(session);
    
    return "stripe"

  }


  public async listen({request, response}:HttpContextContract){

    const axios = require('axios');
    const apiResponse = new Response(response);
    const stripekey = Env.get("STRIPEKEY")
    const stripe = require('stripe')(`${stripekey}`);
    const endpointSecret = "whsec_0a5090896986bfb24259ec5b3bd2a1b40e5f228e45ee81e4462ed1f148ce4b63";

    return "listen"

  }
  public async fetch({request, response}:HttpContextContract){

    const axios = require('axios');
    const apiResponse = new Response(response);
    const stripekey = Env.get("STRIPEKEY")
    const stripe = require('stripe')(`${stripekey}`);
    const endpointSecret = "whsec_0a5090896986bfb24259ec5b3bd2a1b40e5f228e45ee81e4462ed1f148ce4b63";

    // const data = {
    
    //   "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"
    // }

    // const config = {
    //   method:'GET',
    //   url: `https://f324-175-176-45-158.ngrok.io/stripe/listen`,
    //   headers: { 
        
    //     'Content-Type': 'application/json'
    //   },
    //  // data:data
    // }

    // const details = await axios(config)
    // console.log(details);
   
    
    return "listen"

  }
  //https://f324-175-176-45-158.ngrok.io/stripe/listen
}
