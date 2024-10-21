const express = require("express");
const Teacher = require("../models/Teacher");
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middleware/auth");
const accountOwner = require("../middleware/accountOwner");


router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const existingTeacher = await Teacher.findOne({ email: email });

    if (existingTeacher) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const teacher = new Teacher(req.body);
    await teacher.save();

    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      token,
      teacher: { id: teacher._id, name: teacher.name, email: teacher.email },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email: email });
    if (!teacher) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await teacher.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      token,
      teacher: { id: teacher._id, name: teacher.name, email: teacher.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/" ,authMiddleware , async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id",authMiddleware , async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id",authMiddleware,accountOwner, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id,
       {
      name : req.body.name ,
      email : req.body.email,
      age : req.body.age 
    }, {
      new: true,
      runValidators: true,
    });
    if (!teacher) {
      return res.status(404).json({ message: "teacher not found" });
    }
    res.status(200).json({teacher:
       { id: teacher._id,
         name: teacher.name,
          email: teacher.email ,
          age: teacher.age },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id",authMiddleware,accountOwner, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "teacher not found" });
    }
    res.status(200).json({ message: "teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
