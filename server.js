const express = require('express');
const mongoose = require('mongoose');
const app = express();

const teacherRoutes = require('./routes/teacherRoutes');
const courseRoutes = require('./routes/courseRoutes');
const videoRoutes = require('./routes/videoRoutes');
const commentRoutes = require('./routes/CommentRoutes');


require('dotenv').config();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/task7').then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));


app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
 app.use('/api/videos', videoRoutes);
 app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});