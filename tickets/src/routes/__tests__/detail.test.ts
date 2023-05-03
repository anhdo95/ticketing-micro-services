import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it('returns 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .expect(404)
})

it('returns the ticket if the ticket is found', async () => {
  const ticket = { title: 'test', price: 10 }
  const cookie = signin()

  const ticketResponse = await request(app)
    .post("/api/tickets")
    .set('Cookie', cookie)
    .send(ticket)
    .expect(201)

  const response = await request(app)
    .get(`/api/tickets/${ticketResponse.body.id}`)
    .set('Cookie', cookie)
    .expect(200)  
  
  expect(response.body.title).toBe(ticket.title)
  expect(response.body.price).toBe(ticket.price)
})
