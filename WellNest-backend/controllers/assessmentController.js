const pool = require("../config/db");

const { notifyUser } = require("./notificationController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure 'uploads/' folder exists, if not create it dynamically
    const dir = "uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, "uploads/"); // Ensure this folder exists in your project
  },
  filename: function (req, file, cb) {
    //   cb(null, `${Date.now()}_${file.originalname}`);
    // },
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  },
});

// const upload = multer({ storage: storage });
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Only allow certain file types (jpg, png, jpeg)
    const fileTypes = /jpeg|avif|jpg|png|webp/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"), false);
  },
}); // Define upload but do not call .single here

// Create a new assessment
const createAssessment = async (req, res) => {
  const { co_id } = req.params;
  const { title, questions, scores } = req.body;
  //   console.log(co_id, title, photo, questions);
  // For binary data storage
  const photo = req.file ? req.file.path : null;
  console.log(photo);
  let photoData = null;
  if (photo) {
    try {
      // Read the image file as binary data
      photoData = fs.readFileSync(photo);
    } catch (error) {
      console.error("Error reading profile image:", error);
      return res.status(500).json({ error: "Failed to read profile image" });
    }
  }
  try {
    const assessmentResult = await pool.query(
      "INSERT INTO co_assessments (co_id, title, photo) VALUES ($1, $2, $3) RETURNING assessment_id",
      [co_id, title, photoData || null]
    );
    const assessmentId = assessmentResult.rows[0].assessment_id;

    for (const question of questions) {
      //   // Validate question and answers
      //   if (!question.question.trim() || question.answers.length === 0) {
      //     continue; // Skip this question if it's empty or has no answers
      //   }
      // Validate question and answers
      if (!question.question || !question.question.trim()) {
        console.warn(`Skipping question: ${question.question}`);
        continue; // Skip this question if it's empty or has no answers
      }

      const questionResult = await pool.query(
        "INSERT INTO co_assessment_questions (assessment_id, question_text) VALUES ($1, $2) RETURNING question_id",
        [assessmentId, question.question]
      );
      const questionId = questionResult.rows[0].question_id;

      for (const answer of question.answers) {
        // Validate answer text and mark
        if (!answer.text.trim() || isNaN(parseInt(answer.mark, 10))) {
          continue; // Skip this answer if it's empty or mark is not a valid number
        }

        await pool.query(
          "INSERT INTO co_assessment_answers (question_id, answer_text, mark) VALUES ($1, $2, $3)",
          [questionId, answer.text, parseInt(answer.mark, 10)]
        );
      }
    }

    // Insert overall scores and results
    for (const score of scores) {
      // Validate score range and result
      if (!score.range.trim() || !score.result.trim()) {
        console.warn(`Skipping score: ${JSON.stringify(score)}`);
        continue; // Skip this score if it's empty
      }

      await pool.query(
        "INSERT INTO assessment_results (assessment_id, score_range, result_text) VALUES ($1, $2, $3)",
        [assessmentId, score.range, score.result]
      );
    }

    res.status(201).json({ message: "Assessment created successfully." });
  } catch (error) {
    console.error("Error creating assessment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the assessment." });
  }
};

// Fetch assessments by co_id
const getAssessmentsByCoId = async (req, res) => {
  const { co_id } = req.params;
  try {
    const assessmentsResult = await pool.query(
      `SELECT assessment_id, title, created_at,
       CASE 
            WHEN photo IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(photo, 'base64')) 
            ELSE NULL 
        END AS photo FROM co_assessments WHERE co_id = $1 ORDER BY created_at DESC`,
      [co_id]
    );

    const assessments = assessmentsResult.rows.map((assessment) => ({
      assessment_id: assessment.assessment_id,
      title: assessment.title,
      photo: assessment.photo ? assessment.photo.toString("base64") : null,
    }));
    console.log(assessments);
    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching assessments." });
  }
};
// Fetch a specific assessment by ID
const getAssessmentById = async (req, res) => {
  const { assessmentId } = req.params;
  try {
    const assessmentResult = await pool.query(
      "SELECT assessment_id, title, photo FROM co_assessments WHERE assessment_id = $1",
      [assessmentId]
    );

    if (assessmentResult.rows.length === 0) {
      return res.status(404).json({ message: "Assessment not found." });
    }

    const assessment = assessmentResult.rows[0];

    const questionsResult = await pool.query(
      `SELECT question_id, question_text
       
       FROM co_assessment_questions WHERE assessment_id = $1`,
      [assessment.assessment_id]
    );

    const questions = await Promise.all(
      questionsResult.rows.map(async (question) => {
        const answersResult = await pool.query(
          "SELECT answer_text, mark FROM co_assessment_answers WHERE question_id = $1",
          [question.question_id]
        );
        return {
          question: question.question_text,
          answers: answersResult.rows.map((answer) => ({
            text: answer.answer_text,
            mark: answer.mark,
          })),
        };
      })
    );

    res.json({
      assessment_id: assessment.assessment_id,
      title: assessment.title,
      photo: assessment.photo ? assessment.photo.toString("base64") : null,
      questions,
    });
  } catch (error) {
    console.error("Error fetching assessment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the assessment." });
  }
};

// Update an existing assessment
const updateAssessment = async (req, res) => {
  const { assessmentId } = req.params; // Get assessment ID from route params
  const { title, photo, questions } = req.body; // Get data from request body

  try {
    // Update the assessment
    const assessmentResult = await pool.query(
      "UPDATE co_assessments SET title = $1, photo = $2 WHERE assessment_id = $3 RETURNING assessment_id",
      [title, photo ? Buffer.from(photo, "base64") : null, assessmentId]
    );

    if (assessmentResult.rowCount === 0) {
      return res.status(404).json({ message: "Assessment not found." });
    }

    // Clear existing questions and answers
    await pool.query(
      "DELETE FROM co_assessment_questions WHERE assessment_id = $1",
      [assessmentId]
    );
    await pool.query(
      "DELETE FROM co_assessment_answers WHERE question_id IN (SELECT question_id FROM co_assessment_questions WHERE assessment_id = $1)",
      [assessmentId]
    );

    // Insert updated questions and answers
    for (const question of questions) {
      const questionResult = await pool.query(
        "INSERT INTO co_assessment_questions (assessment_id, question_text) VALUES ($1, $2) RETURNING question_id",
        [assessmentId, question.question]
      );
      const questionId = questionResult.rows[0].question_id;

      for (const answer of question.answers) {
        await pool.query(
          "INSERT INTO co_assessment_answers (question_id, answer_text, mark) VALUES ($1, $2, $3)",
          [questionId, answer.text, parseInt(answer.mark, 10)]
        );
      }
    }

    res.status(200).json({ message: "Assessment updated successfully." });
  } catch (error) {
    console.error("Error updating assessment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the assessment." });
  }
};

const deleteAssessment = async (req, res) => {
  const { assessmentId } = req.params; // Extract assessmentId from request params

  try {
    // Delete answers associated with the questions of this assessment
    await pool.query(
      `DELETE FROM co_assessment_answers WHERE question_id IN 
        (SELECT question_id FROM co_assessment_questions WHERE assessment_id = $1)`,
      [assessmentId]
    );

    // Delete questions associated with this assessment
    await pool.query(
      "DELETE FROM co_assessment_questions WHERE assessment_id = $1",
      [assessmentId]
    );

    // Delete the assessment itself
    const result = await pool.query(
      "DELETE FROM co_assessments WHERE assessment_id = $1 RETURNING *",
      [assessmentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Assessment not found." });
    }

    res.status(200).json({ message: "Assessment deleted successfully." });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the assessment." });
  }
};

// Create overall scores and results for an assessment
const createAssessmentResults = async (req, res) => {
  const { assessmentId } = req.params; // Get assessment ID from route params
  const { scores } = req.body; // Get scores from request body

  try {
    for (const score of scores) {
      await pool.query(
        "INSERT INTO assessment_results (assessment_id, score_range, result_text) VALUES ($1, $2, $3)",
        [assessmentId, score.range, score.result]
      );
    }

    res
      .status(201)
      .json({ message: "Assessment results created successfully." });
  } catch (error) {
    console.error("Error creating assessment results:", error);
    res.status(500).json({
      error: "An error occurred while creating the assessment results.",
    });
  }
};

// Fetch assessment results by assessment ID
const getAssessmentResultsById = async (req, res) => {
  const { assessmentId } = req.params;
  try {
    const resultsResult = await pool.query(
      "SELECT score_range, result_text FROM assessment_results WHERE assessment_id = $1",
      [assessmentId]
    );

    const results = resultsResult.rows.map((result) => ({
      range: result.score_range,
      result: result.result_text,
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching assessment results:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching results." });
  }
};

// Update assessment results
const updateAssessmentResults = async (req, res) => {
  const { assessmentId } = req.params; // Get assessment ID from route params
  const { scores } = req.body; // Get scores from request body

  try {
    // Clear existing results
    await pool.query(
      "DELETE FROM assessment_results WHERE assessment_id = $1",
      [assessmentId]
    );

    // Insert updated scores
    for (const score of scores) {
      await pool.query(
        "INSERT INTO assessment_results (assessment_id, score_range, result_text) VALUES ($1, $2, $3)",
        [assessmentId, score.range, score.result]
      );
    }

    res
      .status(200)
      .json({ message: "Assessment results updated successfully." });
  } catch (error) {
    console.error("Error updating assessment results:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the results." });
  }
};

// Correctly export the function
module.exports = {
  createAssessment,
  upload,
  getAssessmentsByCoId,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  createAssessmentResults,
  getAssessmentResultsById,
  updateAssessmentResults,
};
