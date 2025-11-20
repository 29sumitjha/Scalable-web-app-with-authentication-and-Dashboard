const express = require('express');
const router = express.Router();
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskValidation, validate } = require('../utils/validation');

router.route('/')
  .get(protect, getTasks)
  .post(protect, taskValidation, validate, createTask);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, taskValidation, validate, updateTask)
  .delete(protect, deleteTask);

module.exports = router;