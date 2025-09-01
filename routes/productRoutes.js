import express from "express";
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import authenticateToken from "../middlewares/auth.js";
const router = express.Router();

router.get("/", authenticateToken, getProducts);
router.get("/:id", authenticateToken, getProduct);
router.post("/", authenticateToken, addProduct);
router.put("/:id", authenticateToken, updateProduct);
router.delete("/:id", authenticateToken, deleteProduct);
export default router;