
import Response from 'App/Helpers/Response';
import RandomString from 'App/Services/RandomString'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GatewayValidator from 'App/Validators/GatewayValidator';
import Paymentgateway from 'App/Repositories/PaymentGatewayRepository';
export default class PaymentgatewaysController {
  public async addGateway({ request,response }: HttpContextContract){
    const apiResponse = new Response(response);
    
    const validate = request.validate(GatewayValidator)
    const code = RandomString.generate(4, 'alphanumeric');
    console.log(Paymentgateway);
    
    return

    await Paymentgateway.create({
      'code':(await validate).name.substring(0,4)+"-"+code,
     'name': (await validate).name

    })
    
    
    return apiResponse.ok("Gateway Successfully added")
 
  }
}
