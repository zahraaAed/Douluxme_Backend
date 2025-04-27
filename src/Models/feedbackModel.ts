import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../Config/db.js';

export interface FeedbackAttributes {
  id: number;
  comment: string;
  ProductId: number;
  UserId: number;
}

export interface FeedbackCreationAttributes extends Optional<FeedbackAttributes, 'id'> {}

class Feedback extends Model<FeedbackAttributes, FeedbackCreationAttributes> implements FeedbackAttributes {
  public id!: number;
  public comment!: string;
  public ProductId!: number;
  public UserId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Feedback.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
  },
  {
    sequelize,
    tableName: 'feedbacks',
    modelName: 'Feedback',
    timestamps: true,
  }
);

export function associateFeedback(productModel: typeof import('./productModel.js').default) {
  Feedback.hasMany(productModel, { foreignKey: 'FeedbackId' });
}

export default Feedback;
