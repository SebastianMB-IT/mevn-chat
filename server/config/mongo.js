import mongoose from 'mongoose'

export const connect = (uri) => {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connected to database')
    })
    .catch((error) => {
      console.log('database connection failed. exiting now...')
      console.error(error)
      process.exit(1)
    })
}
