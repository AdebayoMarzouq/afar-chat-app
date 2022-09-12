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
      Message.belongsTo(models.User)
      Message.belongsTo(models.Room)
    }
  }
  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      message_text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
      parent_message_id: {
        type: DataTypes.UUID,
      },
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