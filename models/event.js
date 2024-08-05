'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
   
    static associate(models) {
      // define association here
      
      Event.belongsToMany(models.User, {
        through: 'Invite',
        foreignKey: 'eventId',
        as: 'invitedUsers'
      });
    }
  }
  Event.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
    },
    title:{
      type: DataTypes.STRING
    },
    description:{
      type: DataTypes.STRING
    },
    date:{
      type: DataTypes.DATE
    },
    location:{
      type: DataTypes.STRING
    },
    userId:{
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'CANCELLED', 'COMPLETED'),
      defaultValue: 'SCHEDULED',
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};