import express from "express";
import { createOrderDetail, getOrderDetails, getOrderDetailById, updateOrderDetail, deleteOrderDetail } from "../Controllers/orderDetailController.js";
import { authenticate, authorize } from "../Middleware/authMiddleware.js"; // Import authentication and authorization middleware


const router = express.Router();

router.post("/create", authenticate, authorize(["customer"]), createOrderDetail);
router.get("/get", authenticate, authorize(["admin"]), getOrderDetails);
router.patch("/update/:id", authenticate, authorize(["admin"]), updateOrderDetail);
router.delete("/delete/:id", authenticate, authorize(["admin"]), deleteOrderDetail);
router.get("/order/:orderId", authenticate, authorize(["admin", "customer"]), getOrderDetailById);

export default router;