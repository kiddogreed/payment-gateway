import Env from '@ioc:Adonis/Core/Env'
import Response from 'App/Helpers/Response';
import RandomString from 'App/Services/RandomString'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import MerchantClientRepository from 'App/Repositories/MerchantClientRepository';
import TransactionEventRepository from 'App/Repositories/TransactionEventRepository';
import TransactionRepository from 'App/Repositories/TransactionRepository';


export default class WebhooksController {
  public async stripe({request, response}:HttpContextContract){
    const apiResponse = new Response(response);
    const referenceNo = RandomString.generate(12);
    const stripekey = Env.get("STRIPEKEY")
    const stripe = require('stripe')(`${stripekey}`);
    const endpointSecret = Env.get("STRIPE_ENDPOINT_KEY")
    const sig = request.header('stripe-signature', '')
    const rawbody = request.raw()
  
    let event = {
      type:''
    }
    try {
      event = stripe.webhooks.constructEvent(rawbody, sig, endpointSecret);
      
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      console.log(err.message);
      
      return apiResponse.badRequest("status 400")
    }
  
    //event.id = referencenumber
    //event.payment_status: 'paid',
   
  

  let customer = ''
  let invoice = ''
  let setupIntent = ''

  const transEvent = await TransactionRepository
    .query()
    .where('gateway_reference_number', event.data.object.id)
    .first()

   
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      // console.log('checkout session completed');

      await  TransactionEventRepository.create({
        "transaction_id": referenceNo,
        'event':`${event.type.toUpperCase()}`,
        'data':`${JSON.stringify(session.total_details)}`,
      })

      transEvent.status = session.payment_status.toUpperCase()
      await transEvent.save()

      return apiResponse.ok("checkout session complete")

      break;
    case 'customer.created':
       customer = event.data.object;
      // Then define and call a function to handle the event customer.created
      await  TransactionEventRepository.create({
        "transaction_id": referenceNo,
        'event':`${event.type.toUpperCase()}`,
        'data':`${JSON.stringify(customer.plan)}`,
      })
      return apiResponse.ok("customer created")
     
      break;
    case 'customer.updated':
       customer = event.data.object;
      // Then define and call a function to handle the event customer.updated
      await  TransactionEventRepository.create({
        "transaction_id": referenceNo,
        'event':`${event.type.toUpperCase()}`,
        'data':`${JSON.stringify(customer.plan)}`,
      })
      return apiResponse.ok("customer updated")
      
      break;
    case 'customer.subscription.created':
      const subscription = event.data.object;
      // Then define and call a function to handle the event customer.subscription.created
      await  TransactionEventRepository.create({
        "transaction_id": referenceNo,
        'event':`${event.type.toUpperCase()}`,
        'data':`${JSON.stringify(subscription.plan)}`,
      })
      return apiResponse.ok("subscription created")

      break;
    case 'invoice.created':
       invoice = event.data.object;
      // Then define and call a function to handle the event invoice.created
      return apiResponse.ok("invoice created")
      
      break;
    case 'invoice.finalized':
       invoice = event.data.object;
      // Then define and call a function to handle the event invoice.finalized
      return apiResponse.ok("invoice finalized")

      break;
    case 'invoice.paid':
       invoice = event.data.object;
      // Then define and call a function to handle the event invoice.paid
      return apiResponse.ok("invoice paid")
     
      break;
    case 'invoice.payment_succeeded':
       invoice = event.data.object;
      // Then define and call a function to handle the event invoice.payment_succeeded
      return apiResponse.ok("invoice payment succeeded")
      
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a function to handle the event payment_method.attached
      return apiResponse.ok("payment attached")
      
      break;
    case 'setup_intent.created':
       setupIntent = event.data.object;
      // Then define and call a function to handle the event setup_intent.created
      return apiResponse.ok("setup intent created")
   
      break;
    case 'setup_intent.succeeded':
       setupIntent = event.data.object;
      // Then define and call a function to handle the event setup_intent.succeeded
      return apiResponse.ok("setup succeeded")
  
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
      return apiResponse.badRequest("Unhandled event type")
      
  }

  
  
    return apiResponse.ok("webhook listening")
    


  }

  public async paypal({request, response}:HttpContextContract){
    const apiResponse = new Response(response);
    const referenceNo = RandomString.generate(12);
    const paypal = require('@paypal/checkout-server-sdk');
    const paypal1 = require('paypal-rest-sdk');
    const clientId = Env.get("PAYPAL_ID")
    const clientSecret =  Env.get("PAYPAL_SECRET")
    const webhook_id = request.input("webhook_id")
    const axios = require('axios');
    const base64 = require('base-64');
    const basicAuth = base64.encode(`${clientId}:${clientSecret}`);
    const rawbody = request.body()
    const webhook_base = Env.get("STRIPE_WEBHOOK_URL")
    
    const correlationId = request.header("Correlation-Id","")
    const paypAuthAlgo = request.header("Paypal-Auth-Algo","")
    const paypCertUrl = request.header("Paypal-Cert-Url","")
    const paypTransId = request.header("Paypal-Transmission-Id","")
    const paypTransSig = request.header("Paypal-Transmission-Sig","")
    const paypTransTime = request.header("Paypal-Transmission-Time","")

    const testheader = {
      "Correlation-Id": correlationId,
      "Paypal-Auth-Algo":paypAuthAlgo,
      "Paypal-Cert-Url":paypCertUrl,
      "Paypal-Transmission-Id":paypTransId,
      "Paypal-Trasmission-Sig":paypTransSig,
      "RequestBody": rawbody
    }

    if(!rawbody){
      return apiResponse.badRequest("Unhandled event type")
    }
    if(rawbody){
     
      await  TransactionEventRepository.create({
        "transaction_id": referenceNo,
        'event':`${testheader.RequestBody.event_type.toUpperCase()}`,
        'data':`${JSON.stringify(testheader.RequestBody)}`,
      })

      const transEvent = await TransactionRepository
      .query()
      .where('gateway_reference_number', testheader.RequestBody.resource.id)
      .first()

      transEvent.status = testheader.RequestBody.resource.intent.toUpperCase()
      await transEvent.save()
      
      console.log(transEvent);
      
    }
   
    return apiResponse.ok(" webhook listener")

  }

  public async multipay({request, response}:HttpContextContract){
    const apiResponse = new Response(response);
   
    return apiResponse.ok("Multipay  webhook listener")

    
    
  }


}
