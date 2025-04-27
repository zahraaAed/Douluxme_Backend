// productModel.ts
import sequelize from '../Config/db.js';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ProductAttributes {
  id: number;
  name: string;
  nutId: number;
  chocolateId: number;
  categoryId: number;
  userId: number;
  boxSize?: number;
  price: number;
  image: string;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public nutId!: number;
  public chocolateId!: number;
  public categoryId!: number;
  public userId!: number;
  public boxSize?: number;
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
    },
    chocolateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    boxSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
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

export default Product;
