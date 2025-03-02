import express from "express";
import { getUserById, createUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", getUserById);
router.post("/create-user", createUser);

export default router;
