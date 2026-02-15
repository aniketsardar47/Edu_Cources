const Course = require("../models/Course");

// Create Course (Admin)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail } = req.body;

    // Check if course already exists
    const existing = await Course.findOne({ title });
    if (existing) {
      return res.status(400).json({ message: "Course already exists" });
    }

    const course = new Course({
      title,
      description,
      thumbnail
    });

    await course.save();

    res.json({
      message: "Course created successfully",
      course
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get All Courses (Home Page)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get Single Course
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
