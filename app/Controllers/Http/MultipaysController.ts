import Env from '@ioc:Adonis/Core/Env'
import Response from 'App/Helpers/Response';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import RandomString from 'App/Services/RandomString'
import RefnoValidator from 'App/Validators/RefnoValidator';
import MultipayValidator from 'App/Validators/MultipayValidator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'



export default class MultipaysController {
 
  public async init({request, response}:HttpContextContract){
    const axios = require('axios');
    const validate = await request.validate(MultipayValidator)
    const txnid = RandomString.generate(20, 'alphanumeric');
    const token = Env.get(`XMULTIPAYTOKEN`)
    const strAmount = validate.amount.toString()
    const strTxnid = txnid.toString()
    const raw_signature = hmacSHA256(`${strAmount}|MSYS-${strTxnid}`, token);
    const hmacDigest= raw_signature.toString();
    const apiResponse = new Response(response);
    const data = {
      "amount": `${validate.amount}`,
      "txnid": `MSYS-${strTxnid}`,
      "digest": hmacDigest,
      "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"

    }
    const config = {
      method:'POST',
      url: 'https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate',
      headers: { 
        'X-MultiPay-Token': token, 
        'X-MultiPay-Code': 'MSYS_TEST_BILLER',
        'Content-Type': 'application/json'
      },
      data:data
    }
  const details = await axios(config)
    if(!details){
      return apiResponse.badRequest("something went wrong")
    }
  return apiResponse.accepted(details.data)
    
  
      
  }

  public async search({request, response}:HttpContextContract){
      const axios = require('axios');
      const token = Env.get(`XMULTIPAYTOKEN`)
      const apiResponse = new Response(response);
      const validate = await request.validate(RefnoValidator)
      const data = {
      
        "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"
  
      }
      const config = {
        method:'GET',
        url: `https://pgi-ws-staging.multipay.ph/api/v2/transactions/${validate.refno}`,
        headers: { 
          'X-MultiPay-Token': token, 
          'X-MultiPay-Code': 'MSYS_TEST_BILLER',
          'Content-Type': 'application/json'
        },
        data:data
      }
    
    const details = await axios(config)
      if(!details){
        return apiResponse.badRequest("something went wrong")
      }
    return apiResponse.accepted(details.data)
        
    }

    public async generate({request, response}:HttpContextContract){
      const axios = require('axios');
      const validate = await request.validate(MultipayValidator)
      const txnid = RandomString.generate(20, 'alphanumeric');
      const token = Env.get(`XMULTIPAYTOKEN`)
      const strAmount = validate.amount.toString()
      const strTxnid = txnid.toString()
      const raw_signature = hmacSHA256(`${strAmount}|MSYS-${strTxnid}`, token);
      const hmacDigest= raw_signature.toString();
      const apiResponse = new Response(response);
      
      const data = {
        "amount": `${validate.amount}`,
        "txnid": `MSYS-${strTxnid}`,
        "digest": hmacDigest,
        "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"
  
      }
      
      const config = {
        method:'POST',
        url: `https://pgi-ws-staging.multipay.ph/api/v2/transactions
        `,
        headers: { 
          'X-MultiPay-Token': token, 
          'X-MultiPay-Code': 'MSYS_TEST_BILLER',
          'Content-Type': 'application/json'
        },
        data:data
      }
    
    const details = await axios(config)
    if(!details){
      return apiResponse.badRequest("something went wrong")
    }
    return apiResponse.accepted(details.data)
        
    }

    public async gcash({request, response}:HttpContextContract){
      const axios = require('axios');
      const validate = await request.validate(MultipayValidator)
      const txnid = RandomString.generate(20, 'alphanumeric');
      const token = Env.get(`XMULTIPAYTOKEN`)
      const strAmount = validate.amount.toString()
      const strTxnid = txnid.toString()
      const raw_signature = hmacSHA256(`${strAmount}|MSYS-${strTxnid}`, token);
      const hmacDigest= raw_signature.toString();
      const apiResponse = new Response(response);
      const data = {
        "amount": `${validate.amount}`,
        "txnid": `MSYS-${strTxnid}`,
        "digest": hmacDigest,
        "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"
  
      }
      const config = {
        method:'post',
        url: 'https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_gcash',
        headers: { 
          'X-MultiPay-Token': token, 
          'X-MultiPay-Code': 'MSYS_TEST_BILLER',
          'Content-Type': 'application/json'
        },
        data:data
      }
    const details = await axios(config)
      if(!details){
        return apiResponse.badRequest("something went wrong")
      }
    return apiResponse.accepted(details.data)
      
    
        
    }
    public async paymayaqr({request, response}:HttpContextContract){
      const axios = require('axios');
      const validate = await request.validate(MultipayValidator)
      const txnid = RandomString.generate(20, 'alphanumeric');
      const token = Env.get(`XMULTIPAYTOKEN`)
      const strAmount = validate.amount.toString()
      const strTxnid = txnid.toString()
      const raw_signature = hmacSHA256(`${strAmount}|MSYS-${strTxnid}`, token);
      const hmacDigest= raw_signature.toString();
      const apiResponse = new Response(response);
      const data = {
        "amount": `${validate.amount}`,
        "txnid": `MSYS-${strTxnid}`,
        "digest": hmacDigest,
        "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"
  
      }
      const config = {
        method:'post',
        url: 'https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_paymaya_qr',
        headers: { 
          'X-MultiPay-Token': token, 
          'X-MultiPay-Code': 'MSYS_TEST_BILLER',
          'Content-Type': 'application/json'
        },
        data:data
      }
    const details = await axios(config)
      if(!details){
        return apiResponse.badRequest("something went wrong")
      }
    return apiResponse.accepted(details.data)
      
    
        
    }
    public async unionpayqr({request, response}:HttpContextContract){
      const axios = require('axios');
      const validate = await request.validate(MultipayValidator)
      const txnid = RandomString.generate(20, 'alphanumeric');
      const token = Env.get(`XMULTIPAYTOKEN`)
      const strAmount = validate.amount.toString()
      const strTxnid = txnid.toString()
      const raw_signature = hmacSHA256(`${strAmount}|MSYS-${strTxnid}`, token);
      const hmacDigest= raw_signature.toString();
      const apiResponse = new Response(response);
      const data = {
        "amount": `${validate.amount}`,
        "txnid": `MSYS-${strTxnid}`,
        "digest": hmacDigest,
        "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"
  
      }
      const config = {
        method:'post',
        url: 'https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_unionpay',
        headers: { 
          'X-MultiPay-Token': token, 
          'X-MultiPay-Code': 'MSYS_TEST_BILLER',
          'Content-Type': 'application/json'
        },
        data:data
      }
    const details = await axios(config)
      if(!details){
        return apiResponse.badRequest("something went wrong")
      }
    return apiResponse.accepted(details.data)
      
    
        
    }
    public async wechatpayqr({request, response}:HttpContextContract){
      const axios = require('axios');
      const validate = await request.validate(MultipayValidator)
      const txnid = RandomString.generate(20, 'alphanumeric');
      const token = Env.get(`XMULTIPAYTOKEN`)
      const strAmount = validate.amount.toString()
      const strTxnid = txnid.toString()
      const raw_signature = hmacSHA256(`${strAmount}|MSYS-${strTxnid}`, token);
      const hmacDigest= raw_signature.toString();
      const apiResponse = new Response(response);
      const data = {
        "amount": `${validate.amount}`,
        "txnid": `MSYS-${strTxnid}`,
        "digest": hmacDigest,
        "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"
  
      }
      const config = {
        method:'post',
        url: 'https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_wechatpay',
        headers: { 
          'X-MultiPay-Token': token, 
          'X-MultiPay-Code': 'MSYS_TEST_BILLER',
          'Content-Type': 'application/json'
        },
        data:data
      }
    const details = await axios(config)
      if(!details){
        return apiResponse.badRequest("something went wrong")
      }
    return apiResponse.accepted(details.data)
      
    
        
    }
    public async alipayqr({request, response}:HttpContextContract){
      const axios = require('axios');
      const validate = await request.validate(MultipayValidator)
      const txnid = RandomString.generate(20, 'alphanumeric');
      const token = Env.get(`XMULTIPAYTOKEN`)
      const strAmount = validate.amount.toString()
      const strTxnid = txnid.toString()
      const raw_signature = hmacSHA256(`${strAmount}|MSYS-${strTxnid}`, token);
      const hmacDigest= raw_signature.toString();
      const apiResponse = new Response(response);
      const data = {
        "amount": `${validate.amount}`,
        "txnid": `MSYS-${strTxnid}`,
        "digest": hmacDigest,
        "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"
  
      }
      const config = {
        method:'post',
        url: 'https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_alipay',
        headers: { 
          'X-MultiPay-Token': token, 
          'X-MultiPay-Code': 'MSYS_TEST_BILLER',
          'Content-Type': 'application/json'
        },
        data:data
      }
    const details = await axios(config)
      if(!details){
        return apiResponse.badRequest("something went wrong")
      }
    return apiResponse.accepted(details.data)
      
    
        
    }
    public async grabpayqr({request, response}:HttpContextContract){
      const axios = require('axios');
      const validate = await request.validate(MultipayValidator)
      const txnid = RandomString.generate(20, 'alphanumeric');
      const token = Env.get(`XMULTIPAYTOKEN`)
      const strAmount = validate.amount.toString()
      const strTxnid = txnid.toString()
      const raw_signature = hmacSHA256(`${strAmount}|MSYS-${strTxnid}`, token);
      const hmacDigest= raw_signature.toString();
      const apiResponse = new Response(response);
      const data = {
        "amount": `${validate.amount}`,
        "txnid": `MSYS-${strTxnid}`,
        "digest": hmacDigest,
        "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"
  
      }
      const config = {
        method:'post',
        url: 'https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_grabpay',
        headers: { 
          'X-MultiPay-Token': token, 
          'X-MultiPay-Code': 'MSYS_TEST_BILLER',
          'Content-Type': 'application/json'
        },
        data:data
      }
    const details = await axios(config)
      if(!details){
        return apiResponse.badRequest("something went wrong")
      }
    return apiResponse.accepted(details.data)
      
    
        
    }
    public async creditcard({request, response}:HttpContextContract){
      const axios = require('axios');
      const validate = await request.validate(MultipayValidator)
      const txnid = RandomString.generate(20, 'alphanumeric');
      const token = Env.get(`XMULTIPAYTOKEN`)
      const strAmount = validate.amount.toString()
      const strTxnid = txnid.toString()
      const raw_signature = hmacSHA256(`${strAmount}|MSYS-${strTxnid}`, token);
      const hmacDigest= raw_signature.toString();
      const apiResponse = new Response(response);
      const data = {
        "amount": `${validate.amount}`,
        "txnid": `MSYS-${strTxnid}`,
        "digest": hmacDigest,
        "callback_url": "http://127.0.0.1:3333/paypal/success/paypalpay"
  
      }
      const config = {
        method:'post',
        url: 'https://pgi-ws-staging.multipay.ph/api/v2/transactions/generate_card',
        headers: { 
          'X-MultiPay-Token': token, 
          'X-MultiPay-Code': 'MSYS_TEST_BILLER',
          'Content-Type': 'application/json'
        },
        data:data
      }
    const details = await axios(config)
      if(!details){
        return apiResponse.badRequest("something went wrong")
      }
    return apiResponse.accepted(details.data)
      
    
        
    }
}
