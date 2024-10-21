const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: { type: String, required: true }

}, { timestamps: true });


teacherSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


teacherSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
