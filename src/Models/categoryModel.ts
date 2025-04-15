import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../Config/db.js';

export interface CategoryAttributes {
  id: number;
  name: string;
  image: string;  
}

export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public image!: string;  

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  // Ensures no duplicate categories
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional field
    },
  },
  {
    sequelize,
    tableName: 'categories',
    modelName: 'Category',
    timestamps: true,
  }
);

export default Category;
