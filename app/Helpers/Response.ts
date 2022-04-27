'use strict'

import { TransformerAbstractI } from '@ioc:Adonis/Addons/Bumblebee';
import { ResponseContract } from '@ioc:Adonis/Core/Response';

export default class Response {
    response: ResponseContract

    constructor(response: ResponseContract) {
      this.response = response;
    }

    async ok(message:String = 'Ok') {
      this.response.status(200).json({
        message
      })
    }
  
    async data(data:{}, message:String = 'Ok') {
      this.response.status(200).json({
        message,
        data
      })
    }

    async resource(resource:TransformerAbstractI, meta:{} = {}, message:String = 'Ok') {
      const data = await resource
      this.response.status(200).json({
        message,
        data,
        meta
      })
    }

    async accepted(data:{}, message:String = 'Accepted') {
      this.response.status(202).json({
        message,
        data
      })
    }
  
    async error(errors:{}, message:String = 'Internal Server Error') {
      this.response.status(500).json({
        message,
        errors
      })
    }
  
    async unableToProcess(errors:{}, message:String = 'Unprocessable Entity') {
      this.response.status(422).json({
        message,
        errors
      })
    }
  
    async notFound(message:String = 'Not Found') {
      this.response.status(404).json({
        message
      })
    }
  
    async forbidden(message:String = 'Forbidden') {
      this.response.status(403).json({
        message
      })
    }

    async unauthorized(message:String = 'Unathorized') {
      this.response.status(401).json({
        message
      })
    }

    async badRequest(message:String = 'Bad Request') {
      this.response.status(400).json({
        message
      })
    }
}
