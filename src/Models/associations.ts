import User from "./userModel.js"
import Product from "./productModel.js"
import Nut from "./nutModel.js"
import Chocolate from "./chocolateModel.js"
import Category from "./categoryModel.js"

export function setupAssociations() {
  // Define User associations
  User.hasMany(Product, { foreignKey: "userId" })

  // Define Nut associations
  Nut.hasMany(Product, { foreignKey: "nutId" })

  // Define Product associations
  Product.belongsTo(User, { foreignKey: "userId" })
  Product.belongsTo(Nut, { foreignKey: "nutId" })

  // Add other associations as needed
  Product.belongsTo(Chocolate, { foreignKey: 'chocolateId' });
 Product.belongsTo(Category, { foreignKey: 'categoryId' });
}
