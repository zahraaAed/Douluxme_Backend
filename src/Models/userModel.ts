import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../Config/db.js';  // Import the sequelize instance

// Interface for the User attributes (without id)
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  name?: string;
  address?: {
    phone: string;
    region: string;
    address_direction: string;
    building: string;
    floor: string;
  } | null;
}

// Interface for creating a User (excluding the `id`)
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: 'customer' | 'admin';
  public name!: string;
  public address!: {
    phone: string;
    region: string;
    address_direction: string;
    building: string;
    floor: string;
  } | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('customer', 'admin'),
      defaultValue: 'customer',
    },
    name: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize, // Pass in the sequelize instance
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  }
);

export default User;
