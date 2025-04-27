import sequelize from '../Config/db.js';
import { DataTypes, Model, Optional } from 'sequelize';

export interface OrderDetailAttributes {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

interface OrderDetailCreationAttributes extends Optional<OrderDetailAttributes, 'id'> {}

class OrderDetail extends Model<OrderDetailAttributes, OrderDetailCreationAttributes> implements OrderDetailAttributes {
  public id!: number;
  public name!: string;
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public price!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'orderDetails',
    modelName: 'OrderDetail', // <-- Add this
    timestamps: true,         // <-- Add this
  }
);

export default OrderDetail;
