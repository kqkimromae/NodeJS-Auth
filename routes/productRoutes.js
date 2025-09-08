import express from "express";
import {
  getProduct,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import authenticateToken from "../middlewares/auth.js";
const router = express.Router();

router.get("/", authenticateToken, getProduct);
router.get("/:id", authenticateToken, getProductById);
router.post("/", authenticateToken, addProduct);
router.put("/:id", authenticateToken, updateProduct);
router.delete("/:id", authenticateToken, deleteProduct);
export default router;