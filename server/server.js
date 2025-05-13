const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const userAdmin = { username: 'admin', password: 'admin111' };
const user1 = { username: 'user1', password: 'password1' };
const user2 = { username: 'user2', password: 'password2' };

const filejson = 'logtimesforusers.json';

// global variable
let logTimes = [];

async function fileLogTimes() {
  try {
    const data = await fs.readFile(filejson, 'utf8');
    logTimes = JSON.parse(data);
  } catch (error) {
    console.log('Could not read the file');
    logTimes = [];
  }
}

function saveLogs() {
  const jsonData = JSON.stringify(logTimes); 
  fs.writeFile(filejson, jsonData)
    .then(() => {
      console.log('the log saved');
    })
    .catch(err => {
      console.log('error with saving log', err);
    });
}

// ---------------------- Login ----------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username, password);

  if (
    (username === userAdmin.username && password === userAdmin.password) ||
    (username === user1.username && password === user1.password) ||
    (username === user2.username && password === user2.password)
  ) {
    res.json({ success: true });
  } else {
    console.log('Login was failed');
    res.json({ success: false, message: 'Invalid username or password' });
  }
});

// ---------------------- time ----------------------
async function fetchToAPI() {
  try {
    const response = await axios.get('https://timeapi.io/api/time/current/zone?timeZone=Europe%2FBerlin');
    return response.data;
  } catch (error) {
    console.error('Error fetch the time:', error.message);
    return { error: 'There is a problem with the time' };
  }
}

function updateTimeLog(username, type, time, date) {
  let foundResulte = false;

  for (let i = 0; i < logTimes.length; i++) {
    if (logTimes[i].username === username && logTimes[i].type === type) {
      logTimes[i].time = time;
      logTimes[i].date = date;
      foundResulte = true;
      break;
    }
  }

  if (!foundResulte) {
    logTimes.push({ username, type, time, date });
  }
}

// ---------------------- Checkin ----------------------
app.post('/checkin', async (req, res) => {
  const { username } = req.body;
  const timeData = await fetchToAPI();

  if (timeData.error) {
    return res.status(500).json({ message: 'Failed to get the time' });
  }

  updateTimeLog(username, 'enter', timeData.time, timeData.date);
  saveLogs(); 
  res.json({ message: 'Successfully checked in at: ' + timeData.time });
});

// ---------------------- Checkout ----------------------
app.post('/checkout', async (req, res) => {
  const { username } = req.body;
  const timeData = await fetchToAPI();

  if (timeData.error) {
    return res.status(500).json({ message: 'Failed to get the time' });
  }

  updateTimeLog(username, 'exit', timeData.time, timeData.date);
  saveLogs(); 
  res.json({ message: 'Successfully checkedout at: ' + timeData.time });
});

// ---------------------- Get Logs ----------------------
app.get('/logtimes', (req, res) => {
  console.log(logTimes); 
  res.json(logTimes);
});

// ---------------------- Admin Edit Log ----------------------
app.put('/admin/edit', (req, res) => {
  const { username, type, newT, newD } = req.body;
  const logTD = logTimes.find(
    (e) => e.username === username && e.type === type
  );

  if (logTD) {
    logTD.time = newT;
    logTD.date = newD;
    saveLogs();
    res.json({ success: true, message: 'LogTD updated successfully' });
  } else {
    res.json({ success: false, message: 'LogTD not found' });
  }
});

// ---------------------- Start Server ----------------------
app.listen(port, async () => {
  await fileLogTimes(); 
  console.log(`Server running at http://localhost:${port}`);
});
