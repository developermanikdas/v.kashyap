import express from "express";
import { login } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.js"; 

const router = express.Router();

router.post("/login", login);


router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

export default router;