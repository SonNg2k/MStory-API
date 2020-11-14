import { config } from "dotenv"
import express from "express"
import { resolve } from "path"
import {dbConnect, setup, initRoutes, handleErr , start } from './app'

config({path: resolve(__dirname, '../.env')})
const app = express()

dbConnect()
setup(app)
initRoutes(app)
handleErr(app)
start(app)
