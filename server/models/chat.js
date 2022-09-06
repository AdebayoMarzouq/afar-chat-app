'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsToMany(models.User, { through: models.Participant })
      Chat.belongsToMany(models.User, { through: models.Message })
    }
  }
  Chat.init(
    {
      chat_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      chat_name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      is_room: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Chat',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )
  return Chat;
};