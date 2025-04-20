import User from "./userModel.js"
import Product from "./productModel.js"
import Nut from "./nutModel.js"
import Chocolate from "./chocolateModel.js";
import Category from "./categoryModel.js"

import { setupAssociations } from "./associations.js"

// Set up all associations
setupAssociations()

// Export all models
export {
  User,
  Product,
  Nut,
  Chocolate,
   Category
}
