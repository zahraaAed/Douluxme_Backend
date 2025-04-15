import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../Config/db.js';
import Nut from './nutModel.js';
import Chocolate from './chocolateModel.js';
import Category from './categoryModel.js';
import User from './userModel.js'; // Assuming you have a User model

export interface ProductAttributes {
  id: number;
  name: string;
  nutId: number;
  chocolateId: number;
  categoryId: number;
  userId: number;  // Admin who created or updated the product
  boxSize?: number;  // Optional: only for products that are boxes
  price: number;
  image: string;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public nutId!: number;
  public chocolateId!: number;
  public categoryId!: number;
  public userId!: number;  // Admin who created or updated the product
  public boxSize?: number;  // Optional field for boxes
  public price!: number;
  public image!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nutId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Nut,
        key: 'id',
      },
    },
    chocolateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Chocolate,
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,  // Assuming you have a User model
        key: 'id',
      },
    },
    boxSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isIn: [[8, 12, 24]],  // Only allows box sizes 6, 12, or 24
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'products',
    modelName: 'Product',
    timestamps: true,
  }
);

// Association between User and Product (One-to-Many relationship)
User.hasMany(Product, { foreignKey: 'userId' });
Product.belongsTo(User, { foreignKey: 'userId' });

export default Product;
