const { Op } = require("sequelize"); // Import Sequelize operators
const ChatMessage = require("../models/ChatMessage"); // Updated for Sequelize
const VideoCall = require("../models/VideoCall"); // Assuming this is also updated for Sequelize

// Send a message
exports.sendMessage = async (req, res) => {
  const { receiver, content, chatType } = req.body;
  const message = await ChatMessage.create({
    sender: req.user.id,
    receiver,
    content,
    chatType,
  });
  res.status(201).json(message);
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  const { userId } = req.params;
  const messages = await ChatMessage.findAll({
    where: {
      [Op.or]: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    },
    order: [["timestamp", "ASC"]],
  });
  res.status(200).json(messages);
};

// Start a video call
exports.startVideoCall = async (req, res) => {
  const { participants } = req.body;
  const videoCall = await VideoCall.create({ participants });
  res.status(201).json(videoCall);
};

// Get ongoing video calls
exports.getOngoingVideoCalls = async (req, res) => {
  const calls = await VideoCall.findAll({ where: { status: "ongoing" } });
  res.status(200).json(calls);
};
