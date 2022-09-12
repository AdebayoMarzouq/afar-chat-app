'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsToMany(models.User, {through: models.Participant })
      Room.belongsToMany(models.User, {through: models.Message })
      Room.hasMany(models.Participant)
      Room.hasMany(models.Message)
      Room.belongsTo(models.User, { as: 'creator' })
    }
  }
  Room.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      room_name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      is_group: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      last_message: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Room',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )
  return Room
};