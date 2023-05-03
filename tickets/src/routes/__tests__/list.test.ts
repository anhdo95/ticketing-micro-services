import request from "supertest";
import { app } from "../../app";

function createTicket() {
  return request(app)
  .post("/api/tickets")
  .set('Cookie', signin())
  .send({ title: 'test', price: 10 })
  .expect(201)
}

it('can fetch a list of tickets', async () => {
  await createTicket()
  await createTicket()
  await createTicket()

  const response = await request(app)
    .get(`/api/tickets/`)
    .set('Cookie', signin())
    .expect(200)

  expect(response.body).toHaveLength(3)
})
