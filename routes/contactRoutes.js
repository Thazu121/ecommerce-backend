import express from "express";
import {
  createContact,
  getContacts,
} from "../controllers/contactController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const contactRouter = express.Router();

contactRouter.post("/", createContact);

contactRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getContacts
);

export default contactRouter;