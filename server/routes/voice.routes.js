import express from "express";

import { voiceCommand } from "../controllers/voice.controller.js";

const router = express.Router();

router.post("/", voiceCommand);

export default router;
