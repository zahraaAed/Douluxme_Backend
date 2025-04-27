import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../Config/db.js';  // Import the sequelize instance

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

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  }
);

export default User;
