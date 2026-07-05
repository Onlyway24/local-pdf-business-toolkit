const express = require('express');
const cors = require('cors');
const path = require('path');
const { runCommand, getCommands } = require('./commands/commandRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/commands', (req, res) => {
  res.json({ commands: getCommands() });
});

app.post('/api/run', (req, res) => {
  const { command, folderPath, clientName } = req.body;

  if (!command || !folderPath) {
    return res.status(400).json({ error: 'Command and folder path are required' });
  }

  try {
    const extraArgs = clientName ? [clientName] : [];
    const execution = runCommand(command, folderPath, extraArgs);
    
    res.json({
      success: true,
      title: execution.title,
      result: execution.result
    });
  } catch (error) {
    console.error('Command Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Web UI running on http://localhost:${PORT}`);
});
