'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Participant.init(
    {
      room_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'Room',
          key: 'room_id',
        },
      },
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'User',
          key: 'user_id',
        },
      },
      left_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Participant',
      timestamps: true,
      createdAt: 'joined_at',
      updatedAt: 'updated_at',
    }
  )
  return Participant
}
