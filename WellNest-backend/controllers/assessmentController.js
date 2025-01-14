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
  const { title, questions } = req.body;
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
      `SELECT assessment_id, title, 
       CASE 
            WHEN photo IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(photo, 'base64')) 
            ELSE NULL 
        END AS photo FROM co_assessments WHERE co_id = $1`,
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

// Correctly export the function
module.exports = {
  createAssessment,
  upload,
  getAssessmentsByCoId,
  getAssessmentById,
};
