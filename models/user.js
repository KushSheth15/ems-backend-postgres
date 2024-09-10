'use strict';

const bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
const db = require('.');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      
      User.hasMany(models.Event,{foreignKey:'userId',as:"createdEvents"});

      User.belongsToMany(models.Event, {
        through: 'Invite',
        foreignKey: 'userId',
        as: 'invitedEvents'
      });

    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tokenType: {
      type: DataTypes.ENUM('ACCESS', 'RESET', 'REFRESH'),
      allowNull: true,
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks:{
      beforeSave:async(user,options)=>{
        if(user.changed('password')){
          const hashedPassword = await bcrypt.hash(user.password,10);
          user.password = hashedPassword;
        }
      }
    }
  });
  return User;
};