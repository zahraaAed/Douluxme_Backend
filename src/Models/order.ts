import sequelize from '../Config/db.js';
import { DataTypes, Model, Optional } from 'sequelize';

export enum OrderStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum PaymentMethod {
  Cash = 'cash',
  Wishmoney = 'wishmoney',
}

export interface OrderAttributes {
  id: number;
  userId: number;
  subtotalPrice: number;
  price: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public subtotalPrice!: number;
  public price!: number;
  public status!: OrderStatus;
  public paymentMethod!: PaymentMethod;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
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
    subtotalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'wishmoney'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'orders', // <- Corrected table name
    modelName: 'Order',   // <- Corrected model name
    timestamps: true,
  }
);

export default Order;
