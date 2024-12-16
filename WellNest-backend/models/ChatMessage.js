const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Assuming you have a Sequelize instance in db.js

const ChatMessage = sequelize.define("ChatMessage", {
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiver: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  chatType: {
    type: DataTypes.ENUM("private", "group"),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ChatMessage;
