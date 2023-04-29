import bcrypt from 'bcrypt'

import { type Encrypter } from '../../data/protocols/encrypter'

export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {
    this.salt = salt
  }

  async encrypt(value: string): Promise<string> {
    bcrypt.hash(value, this.salt)

    return await new Promise((resolve) => {
      resolve('')
    })
  }
}
