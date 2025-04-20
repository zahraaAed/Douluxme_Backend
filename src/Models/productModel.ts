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
      references: {
        model: 'nuts',
        key: 'id',
      },
    },
    chocolateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chocolates',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
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

// Define associations separately
export async function setupAssociations() {
  const [nutModel, chocolateModel, categoryModel, userModel] = await Promise.all([
    import('./nutModel.js'),
    import('./chocolateModel.js'),
    import('./categoryModel.js'),
    import('./userModel.js'),
  ]);

  Product.belongsTo(nutModel.default, { foreignKey: 'nutId' });
  Product.belongsTo(chocolateModel.default, { foreignKey: 'chocolateId' });
  Product.belongsTo(categoryModel.default, { foreignKey: 'categoryId' });
  Product.belongsTo(userModel.default, { foreignKey: 'userId' });
}

setupAssociations();

export default Product;
