const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Assuming you have a Sequelize instance in db.js

const VideoCall = sequelize.define("VideoCall", {
  participants: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Array of participant IDs
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("ongoing", "ended"),
    defaultValue: "ongoing",
  },
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  endTime: {
    type: DataTypes.DATE,
  },
});

module.exports = VideoCall;
