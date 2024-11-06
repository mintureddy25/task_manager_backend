const express = require("express");
const router = express.Router();
const pool = require("../db");
const { verifyToken } = require("../middleware/middleware");


function isNotEmpty(value) {
  return value && value.trim() !== "";
}

function isValidPrice(value) {
  if (value === undefined || value === null || value.toString().trim() === "") {
    return false;
  }

  return (
    !isNaN(value) && typeof parseFloat(value) === "number" && isFinite(value)
  );
}

function isValidCategoryId(value) {
  return Number.isInteger(parseInt(value, 10));
}

router.post("/", verifyToken, async (req, res) => {
  
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!isNotEmpty(title)) {
    res.status(400).json({ message: "Invalid task title" });
    return;
  }
  if (!isNotEmpty(description)) {
    res.status(400).json({ message: "Please enter description" });
    return;
  }

  try {
    
    const [taskRows] = await pool.execute('SELECT * FROM tasks WHERE name = ? AND description = ? AND user_id = ?',
      [title, description, userId]);

    if (taskRows.length > 0) {
      res.status(400).json({ message: 'Task already exists' });
      return;
    }
    const [insertResult] = await pool.execute('INSERT INTO tasks (name, description, user_id, type) VALUES (?, ?, ?, ?)', [title, description, userId, 'To Do']);
    
    res.status(200).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put("/:taskId", verifyToken, async (req, res) => {
    const taskId = req.params.taskId;
    const { title, description, type } = req.body;
  
    if (!isNotEmpty(title)) {
      res.status(400).json({ message: "Invalid task title" });
      return;
    }
    if (!isNotEmpty(description)) {
      res.status(400).json({ message: "Please enter description" });
      return;
    }
  
    try {

        const query = "Select * from tasks where id = ?";
        const [rows] = await pool.execute(query, [taskId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
      
        const [result] = await pool.execute(
            `UPDATE tasks
             SET name = ?, description = ?, type = ?
             WHERE id = ?`,
            [title, description, type, taskId]);
  
      res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/:taskId', verifyToken, async (req, res) => {
    
    const taskId = req.params.taskId;

    try {

        const taskQuery = "Select * from tasks where id = ?";
        const [taskRows] = await pool.execute(taskQuery, [taskId]);
        if (taskRows.length === 0) {
            return res.status(404).json({ message: "task not found" });
        }
      
        const rowCheckingQuery =
            "SELECT * FROM tasks WHERE id = ?";
        const [taskDetails] = await pool.execute(rowCheckingQuery, [taskId]);

        if (taskDetails.length === 0) {
            return res.status(404).json({ message: "No Task found" });
        } else {
            return res
                .status(200)
                .json({ task: taskDetails[0] });
        }
        
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get("/", verifyToken, async (req, res) => {

    const userId = req.user.id;
    try {
      
      const [tasksRows] = await pool.execute('SELECT * FROM tasks WHERE user_id = ?',[userId]);
      if (tasksRows.length === 0) {
        return res.status(404).json({ message: "No Tasks found" });
    } else {
        return res
            .status(200)
            .json({ tasks: tasksRows });
    }
    
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.delete("/:taskId", verifyToken, async (req, res) => {

    const taskId = req.params.taskId;

    try {

        const taskQuery = "Select * from tasks where id = ?";
        const [taskRows] = await pool.execute(taskQuery, [taskId]);
        if (taskRows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
      
      const [updateResult] = await pool.execute(
        `DELETE FROM tasks WHERE id = ?`,
        [taskId]);
      if (updateResult.length === 0) {
        return res.status(404).json({ message: "No Task found" });
    } else {
        return res.status(200).json({ message: 'Task deleted successfully' });
    }
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;

  