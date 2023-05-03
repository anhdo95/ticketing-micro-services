import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { requireAuth } from "@anhdo-tickets/common";

const router = express.Router();

router.get(
  "/api/tickets",
  requireAuth,
  async (req: Request, res: Response) => {
    const tickets = await Ticket.find();
    res.send(tickets);
  }
);

export { router as getTicketsRouter };
