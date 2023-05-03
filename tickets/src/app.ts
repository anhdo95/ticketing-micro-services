import express from "express";
import 'express-async-errors'
import { json } from "body-parser";
import cookieSession from 'cookie-session'
import { currentUser, errorHandler, NotFoundError } from "@anhdo-tickets/common";

import { createTicketRouter } from './routes/new'

const app = express();

app.set('trust proxy', 1)

app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser)

app.use(createTicketRouter);

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
