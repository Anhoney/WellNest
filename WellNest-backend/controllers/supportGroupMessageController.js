//supportGroupMessageController.js
const pool = require("../config/db");

// Function to add a message to a support group
const addSupportGroupMesssage = async (req, res) => {
  const { group_id, user_id, message, message_date, message_time } = req.body;

  const query = `
    INSERT INTO support_group_message (group_id, user_id, message, message_date, message_time) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *; 
    `;

  const values = [group_id, user_id, message, message_date, message_time];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res
        .status(500)
        .json({ error: `Failed to send message to group ${group_id}` });
    }
    res.status(200).json(result.rows[0]); // Return the first row of the result
  } catch (error) {
    console.error("Error send message to support group:", error);
    res
      .status(500)
      .json({ error: `Failed to send message to support group ${group_id}` });
  }
};

// Function to fetch messages for a specific support group by group ID
const getSupportGroupMessageByGroupId = async (req, res) => {
  const { group_id } = req.params;

  const query = `
    SELECT 
        sgm.id,
        sgm.group_id,
        sgm.user_id,
        sgm.message,
        sgm.message_date,
        sgm.message_time,
        u.full_name
    FROM 
        support_group_message sgm
    JOIN 
        users u ON sgm.user_id = u.id
    WHERE 
        sgm.group_id = $1
    ORDER BY 
        sgm.message_date, sgm.message_time;
    `;

  const values = [group_id];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Support Group message not found." });
    }
    res.status(200).json(result.rows); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching support group messages:", error.message);
    res.status(500).json({ error: "Failed to fetch support group messages." });
  }
};

// Function to update an existing support group message
const updateSupportGroupMessage = async (req, res) => {
  const { message, message_date, message_time } = req.body;
  const { message_id } = req.params;

  const query = `
    UPDATE support_group_message
    SET message = $1, message_date = $2, message_time = $3
    WHERE id = $4 RETURNING *;
    `;

  const values = [message, message_date, message_time, message_id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Support Group Message not found." });
    }
    res.status(200).json(result.rows[0]); // Return the first row of the result
  } catch (error) {
    console.error("Error updating support group mesage:", error.message);
    res.status(500).json({ error: "Failed to update support group message." });
  }
};

// Function to delete a support group message
const deleteSupportGroupMessage = async (req, res) => {
  const { message_id } = req.params;

  const query =
    // Return the deleted row for confirmation
    ` DELETE FROM support_group_message
    WHERE id = $1 RETURNING *;
  `;

  const values = [message_id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Support Group message not found or already deleted" });
    }
    res.status(200).json({
      message: "Support Group message deleted successfully",
      support_group_message: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting support group message:", error.message);
    res.status(500).json({ error: "Failed to delete support group message." });
  }
};

module.exports = {
  addSupportGroupMesssage,
  getSupportGroupMessageByGroupId,
  updateSupportGroupMessage,
  deleteSupportGroupMessage,
};
