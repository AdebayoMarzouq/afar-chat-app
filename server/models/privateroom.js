'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PrivateRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PrivateRoom.belongsTo(models.Room)
    }
  }
  PrivateRoom.init(
    {
      private_room_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_one: {
        type: DataTypes.UUID,
      },
      user_two: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: 'PrivateRoom',
      timestamps: false,
    }
  )
  return PrivateRoom;
};