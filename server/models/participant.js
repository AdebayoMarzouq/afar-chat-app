'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Participant.belongsTo(models.Chat)
      Participant.belongsTo(models.User)
    }
  }
  Participant.init(
    {
      particpant_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      chat_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Chat',
          key: 'chat_id',
        },
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'User',
          key: 'user_id',
        },
      },
      left_at: {
        type: DataTypes.DATE,
      }
    },
    {
      sequelize,
      modelName: 'Participant',
      timestamps: true,
      createdAt: 'joined_at',
      updatedAt: 'updated_at',
    }
  )
  return Participant;
};