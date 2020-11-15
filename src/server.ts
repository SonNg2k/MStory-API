import { config } from "dotenv"
import express from "express"
import { resolve } from "path"
import { connectDB, errHandler, initRoutes, setup, start } from './app'
import seedDB from "./seedDB"

config({ path: resolve(__dirname, '../.env') })

connectDB().then(() => {
    const app = express()
    setup(app)
    initRoutes(app)
    if (process.env.SEED_DB === 'true') seedDB()
    errHandler(app)
    start(app)
})
.catch(err => console.log('Cannot connect to DB --> ', err))
