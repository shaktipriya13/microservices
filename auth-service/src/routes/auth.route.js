import express from "express";
import { resgiterUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/", resgiterUser);

export { router };
