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
  const { title, questions, photo, scores } = req.body;
  //   console.log(co_id, title, photo, questions);
  // For binary data storage
  // const photo = req.file ? req.file.path : null;
  // console.log(photo);
  // let photoData = null;
  // if (photo) {
  //   try {
  //     // Read the image file as binary data
  //     photoData = fs.readFileSync(photo);
  //   } catch (error) {
  //     console.error("Error reading profile image:", error);
  //     return res.status(500).json({ error: "Failed to read profile image" });
  //   }
  // }
  try {
    const assessmentResult = await pool.query(
      "INSERT INTO co_assessments (co_id, title, photo) VALUES ($1, $2, $3) RETURNING assessment_id",
      [co_id, title, photo ? Buffer.from(photo, "base64") : null]
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
    // console.log(assessments);
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

//Elderly
const getAllAssessments = async (req, res) => {
  // const { co_id } = req.params;
  try {
    const assessmentsResult = await pool.query(
      `SELECT assessment_id, title, created_at,
       CASE 
            WHEN photo IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(photo, 'base64')) 
            ELSE NULL 
        END AS photo FROM co_assessments ORDER BY created_at DESC`
    );

    const assessments = assessmentsResult.rows.map((assessment) => ({
      assessment_id: assessment.assessment_id,
      title: assessment.title,
      photo: assessment.photo ? assessment.photo.toString("base64") : null,
    }));
    // console.log(assessments);
    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching assessments." });
  }
};

// Fetch questions and answers for a specific assessment
const getAssessmentQuestionsAndAnswers = async (req, res) => {
  const { assessmentId } = req.params; // Get assessment ID from route params

  try {
    // Fetch questions for the assessment
    const questionsResult = await pool.query(
      "SELECT question_id, question_text FROM co_assessment_questions WHERE assessment_id = $1",
      [assessmentId]
    );

    // Fetch answers for each question
    const questions = await Promise.all(
      questionsResult.rows.map(async (question) => {
        const answersResult = await pool.query(
          "SELECT answer_id, answer_text, mark FROM co_assessment_answers WHERE question_id = $1",
          [question.question_id]
        );
        return {
          question_id: question.question_id,
          question_text: question.question_text,
          answers: answersResult.rows.map((answer) => ({
            answer_id: answer.answer_id,
            answer_text: answer.answer_text,
            mark: answer.mark,
          })),
        };
      })
    );

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching assessment questions and answers:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching questions." });
  }
};

// Calculate total marks and fetch result based on selected answers
const calculateTotalMarksAndFetchResult = async (req, res) => {
  const { assessmentId } = req.params; // Get assessment ID from route params
  const { answers } = req.body; // Get selected answers from request body

  try {
    let totalMarks = 0;

    // Calculate total marks based on selected answers
    for (const questionId in answers) {
      const answerId = answers[questionId];
      const answerResult = await pool.query(
        "SELECT mark FROM co_assessment_answers WHERE answer_id = $1",
        [answerId]
      );

      if (answerResult.rows.length > 0) {
        totalMarks += answerResult.rows[0].mark; // Add the mark of the selected answer
      }
    }

    // Fetch the result based on total marks
    const resultResult = await pool.query(
      "SELECT result_text, score_range FROM assessment_results WHERE assessment_id = $1",
      [assessmentId]
    );

    // Check the total marks against the score ranges
    let resultText = "No result found for the given marks.";
    for (const row of resultResult.rows) {
      const [min, max] = row.score_range.split("-").map(Number); // Split the range and convert to numbers
      if (totalMarks >= min && totalMarks <= max) {
        resultText = row.result_text; // Set the result text if total marks fall within the range
        break; // Exit the loop once we find a matching range
      }
    }

    res.status(200).json({ totalMarks, resultText });
  } catch (error) {
    console.error("Error calculating total marks and fetching result:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};

// Save assessment results
const saveAssessmentResults = async (req, res) => {
  const { assessmentId } = req.params; // Get assessment ID from route params
  const { userId, totalMarks, overallResult } = req.body; // Get userId, selected answers, and total marks from request body

  try {
    // Insert the results into the results table
    const resultInsert = await pool.query(
      "INSERT INTO assessment_history (user_id, assessment_id, total_marks, overall_result, assessment_date) VALUES ($1, $2, $3, $4, NOW()) RETURNING assessment_history_id",
      [userId, assessmentId, totalMarks, overallResult]
    );

    const resultId = resultInsert.rows[0].id;

    res.status(201).json({ message: "Assessment results saved successfully." });
  } catch (error) {
    console.error("Error saving assessment results:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving the results." });
  }
};

// Fetch assessment history for a user
const getAssessmentHistory = async (req, res) => {
  const { userId } = req.params; // Get user ID from route params

  try {
    const historyResult = await pool.query(
      `SELECT ah.assessment_history_id, ah.total_marks, ah.assessment_date, ah.overall_result,
              ca.title, 
              CASE 
                WHEN ca.photo IS NOT NULL 
                THEN CONCAT('data:image/png;base64,', ENCODE(ca.photo, 'base64')) 
                ELSE NULL 
              END AS photo 
       FROM assessment_history ah
       JOIN co_assessments ca ON ah.assessment_id = ca.assessment_id
       WHERE ah.user_id = $1
       ORDER BY ah.assessment_date DESC`,
      [userId]
    );

    const history = historyResult.rows.map((item) => ({
      assessment_history_id: item.assessment_history_id,
      total_marks: item.total_marks,
      overall_result: item.overall_result,
      assessment_date: item.assessment_date,
      title: item.title,
      photo: item.photo,
    }));

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching assessment history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the history." });
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
  getAllAssessments,
  getAssessmentQuestionsAndAnswers,
  calculateTotalMarksAndFetchResult,
  saveAssessmentResults,
  getAssessmentHistory,
};
