'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.hasOne(models.Message)
    }
  }
  Message.init(
    {
      message_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      message_text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      room_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Room',
          key: 'room_id',
        },
      },
      sender_id: {
        type: DataTypes.UUID,
        references: {
          model: 'User',
          key: 'user_id',
        },
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
      parend_message_id: {
        type: DataTypes.TEXT
      }
    },
    {
      sequelize,
      modelName: 'Message',
      createdAt: 'sent_at',
      updatedAt: 'updated_at',
    }
  )
  return Message;
};