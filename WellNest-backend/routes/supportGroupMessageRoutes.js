// routes/supportGroupRoute.js
const express = require("express");
const router = express.Router();
const { addSupportGroupMesssage, getSupportGroupMessageByGroupId, updateSupportGroupMessage, deleteSupportGroupMessage } = require("../controllers/supportGroupMessageController")
const authenticateToken = require("../middleware/authMiddleware");

router.post(
    '/support_group_message/',
    authenticateToken,
    addSupportGroupMesssage,
)

router.get(
    '/support_group_message/:group_id',
    authenticateToken,
    getSupportGroupMessageByGroupId
)

router.patch(
    '/support_group_message/:message_id',
    authenticateToken,
    updateSupportGroupMessage
)

router.delete(
    '/support_group_message/:message_id',
    authenticateToken,
    deleteSupportGroupMessage
)

module.exports = router;
