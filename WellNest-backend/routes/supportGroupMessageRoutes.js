// routes/supportGroupRoute.js
const express = require("express");
const router = express.Router();
const {
  addSupportGroupMesssage,
  getSupportGroupMessageByGroupId,
  updateSupportGroupMessage,
  deleteSupportGroupMessage,
} = require("../controllers/supportGroupMessageController");
const authenticateToken = require("../middleware/authMiddleware");

// Route to add a new message to a support group

router.post(
  "/support_group_message/",
  authenticateToken,
  addSupportGroupMesssage
);

// Route to get all messages for a specific support group by group ID
router.get(
  "/support_group_message/:group_id",
  authenticateToken,
  getSupportGroupMessageByGroupId
);

// Route to update an existing support group message by message ID
router.patch(
  "/support_group_message/:message_id",
  authenticateToken,
  updateSupportGroupMessage
);

// Route to delete a specific support group message by message ID
router.delete(
  "/support_group_message/:message_id",
  authenticateToken,
  deleteSupportGroupMessage
);

module.exports = router;
