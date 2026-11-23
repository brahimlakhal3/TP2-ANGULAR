require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo-db';

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connectée.');
    app.listen(PORT, () => {
      console.log(`Backend démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erreur de connexion MongoDB :', error.message);
    process.exit(1);
  });
