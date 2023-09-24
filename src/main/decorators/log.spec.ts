import { serverError } from '../../presentation/helpers/http-helper'
import type {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import type { LogErrorRepository } from '../../data/protocols/log-error-repository'

describe('LogControllerDecorator', () => {
  class ControllerTest implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return { body: '', statusCode: 500 }
    }
  }

  class ControllerWithErrorTest implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const error = new Error()

      error.stack = 'failed_stack'
      return serverError(error)
    }
  }

  class LogErrorRepositoryTest implements LogErrorRepository {
    async log(stack: string): Promise<void> {}
  }

  test('Should call Controller with correct request values', async () => {
    const controllerTest = new ControllerTest()
    const logController = new LogControllerDecorator(
      controllerTest,
      new LogErrorRepositoryTest()
    )

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
    const logController = new LogControllerDecorator(
      controllerTest,
      new LogErrorRepositoryTest()
    )

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

  test('Should call LogErorRepository with correct error if controller returns a server error', async () => {
    const logRepo = new LogErrorRepositoryTest()
    const logController = new LogControllerDecorator(
      new ControllerWithErrorTest(),
      logRepo
    )

    const spyLog = jest.spyOn(logRepo, 'log')

    await logController.handle({ body: '' })

    expect(spyLog).toHaveBeenCalledWith('failed_stack')
  })
})
