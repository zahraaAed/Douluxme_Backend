import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../Config/db.js';
import Product from './productModel.js'; // Assuming you have a Product model
export interface NutAttributes {
  id: number;
  variety: string;
  price: number;

}

export interface NutCreationAttributes extends Optional<NutAttributes, 'id'> {}

class Nut extends Model<NutAttributes, NutCreationAttributes> implements NutAttributes {
  public id!: number;
  public variety!: string;
  public price!: number;


  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Nut.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    variety: {
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
    tableName: 'nuts',
    modelName: 'Nut',
    timestamps: true,
  }
);
// In the Nut model (e.g., nut.ts)
export function associateNut(productModel: typeof import('./productModel.js').default) {
  Nut.hasMany(productModel, { foreignKey: 'nutId' });
}

export default Nut;
