import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../Config/db.js';

export interface ChocolateAttributes {
  id: number;
  type: string;
  price: number;

}

export interface ChocolateCreationAttributes extends Optional<ChocolateAttributes, 'id'> {}

class Chocolate extends Model<ChocolateAttributes, ChocolateCreationAttributes> implements ChocolateAttributes {
  public id!: number;
  public type!: string;
  public price!: number;
 

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Chocolate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
 
  },
  {
    sequelize,
    tableName: 'chocolates',
    modelName: 'Chocolate',
    timestamps: true,
  }
);

export default Chocolate;
