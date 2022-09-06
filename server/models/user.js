'use strict'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Room, { through: models.Participant })
      User.belongsToMany(models.Room, { through: models.Message })
    }

    async comparePasswords(password) {
      return await bcrypt.compare(password, this.password)
    }

    generateJWT() {
      return jwt.sign({ user_id: this.user_id, email: this.email, }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      })
    }

  }
  User.init(
    {
      user_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      profile_image: {
        type: DataTypes.STRING,
        defaultValue:
          'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
      },
      password: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
          const hashedPassword = await bcrypt.hash(user.password, salt)
          user.password = hashedPassword
        },
      },
      sequelize,
      modelName: 'User',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )
  return User
}
