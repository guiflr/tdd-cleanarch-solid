import type {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogControllerDecorator', () => {
  class ControllerTest implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return { body: '', statusCode: 500 }
    }
  }
  test('Should call Controller with correct request values', async () => {
    const controllerTest = new ControllerTest()
    const logController = new LogControllerDecorator(controllerTest)

    const request = {
      body: {
        email: 'guiflr@gmail.com',
        name: 'gui',
        password: '123',
        passwordConfirmation: '123'
      }
    }

    const spyController = jest.spyOn(controllerTest, 'handle')

    await logController.handle(request)

    expect(spyController).toHaveBeenCalledWith(request)
  })

  test('Should return the same value of the controller', async () => {
    const controllerTest = new ControllerTest()
    const logController = new LogControllerDecorator(controllerTest)

    const request = {
      body: {
        email: 'guiflr@gmail.com',
        name: 'gui',
        password: '123',
        passwordConfirmation: '123'
      }
    }

    const logResponse = await logController.handle(request)

    expect(logResponse).toEqual({ body: '', statusCode: 500 })
  })
})
