import { config } from "dotenv"
import express from "express"
import { resolve } from "path"
import { setup, initRoutes, errHandler, start, connectDB } from './app'

config({ path: resolve(__dirname, '../.env') })

connectDB().then(() => {
    const app = express()
    setup(app)
    initRoutes(app)
    errHandler(app)
    start(app)
})
.catch(err => console.log('Cannot connect to DB --> ', err))
