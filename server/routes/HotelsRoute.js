import {  createHotel,getHotelById,getHotels, publicHotels, getPopularHotels } from "../Controllers/HotelsController.js";
import { updateHotel,deleteHotel, uploadHotelImages } from "../Controllers/HotelsController.js";
import express from "express";
import protect, {authorizeRoles} from "../Middlewares/auth.js";

const router = express.Router();

router.use((req, res, next) => {
  req.hotelUpload = req.app.uploadHotel;
  next();
});

router.post("/", protect,authorizeRoles("Owner"), createHotel);
router.get("/my-hotels", protect,authorizeRoles("Owner"), getHotels);
router.put("/:id", protect,authorizeRoles("Owner"), updateHotel);
router.delete("/:id", protect,authorizeRoles("Owner"),  deleteHotel); 
router.post("/:id/upload-images", protect,authorizeRoles("Owner"), (req, res, next) => {
  req.hotelUpload.array("images", 10)(req, res, next);
}, uploadHotelImages);
router.get("/:id",getHotelById)
router.get("/popular", getPopularHotels);
router.get("/", publicHotels);

export default router;