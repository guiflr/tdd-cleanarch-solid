import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: String,
  email: String,
  password: String
})

export default model('Account', schema)
