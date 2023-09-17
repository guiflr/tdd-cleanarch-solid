import { ServerError } from '../errors/server-error'
import { type HttpResponse } from '../protocols/http'

export const badResquest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: {
      error: error.name,
      message: error.message
    }
  }
}

export const serverError = (error?: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error?.stack)
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
