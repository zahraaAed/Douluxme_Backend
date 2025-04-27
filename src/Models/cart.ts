import sequelize from '../Config/db.js';
import { DataTypes, Model, Optional } from 'sequelize';

export interface CartAttributes {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id'> {}

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'carts', // usually table names are lowercase plural (best practice)
    modelName: 'Cart',
    timestamps: true,
  }
);

export default Cart;
