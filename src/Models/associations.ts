import User from "./userModel.js";
import Product from "./productModel.js";
import Nut from "./nutModel.js";
import Chocolate from "./chocolateModel.js";
import Category from "./categoryModel.js";
import Feedback from "./feedbackModel.js";
import Order from "./order.js";
import OrderDetail from "./orderDetails.js";

// Add this flag to track if associations have been set up
let associationsSetup = false;

export function setupAssociations() {
  // Check if associations have already been set up
  if (associationsSetup) {
    console.log("Associations already set up, skipping");
    return;
  }
  
  console.log("Setting up associations");
  
  // 🔗 User ↔ Product
  User.hasMany(Product, { foreignKey: "userId", as: "userProducts" });
  Product.belongsTo(User, { foreignKey: "userId", as: "user" });

  // 🔗 Nut ↔ Product
  Nut.hasMany(Product, { foreignKey: "nutId", as: "nutProducts" });
  Product.belongsTo(Nut, { foreignKey: "nutId", as: "nut" });

  // 🔗 Chocolate ↔ Product
  Chocolate.hasMany(Product, { foreignKey: "chocolateId", as: "chocolateProducts" });
  Product.belongsTo(Chocolate, { foreignKey: "chocolateId", as: "chocolate" });

  // 🔗 Category ↔ Product
  Category.hasMany(Product, { foreignKey: "categoryId", as: "categoryProducts" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  // 🔗 User ↔ Feedback
  User.hasMany(Feedback, { foreignKey: "UserId", as: "userFeedbacks" });
  Feedback.belongsTo(User, { foreignKey: "UserId", as: "user" });

  // 🔗 Product ↔ Feedback
  Product.hasMany(Feedback, { foreignKey: "ProductId", as: "productFeedbacks" });
  Feedback.belongsTo(Product, { foreignKey: "ProductId", as: "product" });
  
  //order ↔ orderDetail
  Order.hasMany(OrderDetail, { foreignKey: "orderId", as: "orderDetails" });
  OrderDetail.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  //product ↔ orderDetail
  Product.hasMany(OrderDetail, { foreignKey: "productId", as: "orderDetails" });
  OrderDetail.belongsTo(Product, { foreignKey: "productId", as: "product" });

  //order ↔ user
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  Order.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Mark associations as set up
  associationsSetup = true;
  console.log("Associations setup complete");
}