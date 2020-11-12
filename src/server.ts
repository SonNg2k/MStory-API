import express from "express"
import {dbConnect, setup, initRoutes, handleErr , start } from './app'

const app = express()

dbConnect()
setup(app)
initRoutes(app)
handleErr(app)
start(app)
