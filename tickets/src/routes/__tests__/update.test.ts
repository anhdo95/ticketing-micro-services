import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

const id = new mongoose.Types.ObjectId().toHexString();

it("has a route handler listening to /api/tickets for PUT requests", async () => {
  const response = await request(app).put(`/api/tickets/${id}`).send();

  expect(response.statusCode).not.toBe(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).put(`/api/tickets/${id}`).send().expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send();

  expect(response.statusCode).not.toBe(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({
      title: "test",
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({
      title: "test",
      price: 0,
    })
    .expect(400);
});

it("returns 404 if the provided id does not exist", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({
      title: "test",
      price: 1,
    })
    .expect(404);
});

it("returns 401 if the user does not own the ticket", async () => {
  const ticketToCreate = { title: "basic", price: 2 };
  const ticketToUpdate = { title: "gold", price: 10 };

  const createdResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send(ticketToCreate)
    .expect(201);

  await request(app)
    .put(`/api/tickets/${createdResponse.body.id}`)
    .set("Cookie", signin())
    .send(ticketToUpdate)
    .expect(401);
});

it("updates a ticket with valid inputs", async () => {
  const ticketToCreate = { title: "basic", price: 2 };
  const ticketToUpdate = { title: "gold", price: 10 };
  const cookie = signin();

  const createdResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticketToCreate)
    .expect(201);

  const updatedResponse = await request(app)
    .put(`/api/tickets/${createdResponse.body.id}`)
    .set("Cookie", cookie)
    .send(ticketToUpdate)
    .expect(200);

  expect(updatedResponse.body.title).toBe(ticketToUpdate.title);
  expect(updatedResponse.body.price).toBe(ticketToUpdate.price);
});
