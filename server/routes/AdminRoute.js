import express from "express";
import protect, { authorizeRoles } from "../Middlewares/auth.js";
import { getAllUsers, banUser, unbanUser } from "../Controllers/AdminController.js";

const router = express.Router();

router.use(protect, authorizeRoles("Admin"));

router.get("/users", getAllUsers);
router.put("/users/:id/ban", banUser);
router.put("/users/:id/unban", unbanUser);

export default router;
