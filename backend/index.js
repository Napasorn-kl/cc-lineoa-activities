const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { activities: mockActivities } = require('./mockData');

const app = express();
const PORT = 3001;

// Deep-clone the mock data so we can mutate it at runtime
let activities = JSON.parse(JSON.stringify(mockActivities));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// ─── GET /api/activities?status=joined|not-joined|ended ───────────────────────
app.get('/api/activities', (req, res) => {
  const { status } = req.query;
  const validStatuses = ['joined', 'not-joined', 'ended'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Use joined, not-joined, or ended.' });
  }

  let result = activities;
  if (status) {
    result = activities.filter((a) => a.status === status);
  }

  // Return activities without steps for list view
  const summary = result.map(({ steps, ...rest }) => rest);
  res.json({ activities: summary });
});

// ─── GET /api/activities/:id ──────────────────────────────────────────────────
app.get('/api/activities/:id', (req, res) => {
  const activity = activities.find((a) => a.id === req.params.id);
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }
  res.json({ activity });
});

// ─── POST /api/activity/join ──────────────────────────────────────────────────
app.post('/api/activity/join', (req, res) => {
  const { activityId } = req.body;
  if (!activityId) {
    return res.status(400).json({ error: 'activityId is required' });
  }

  const activity = activities.find((a) => a.id === activityId);
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }
  if (activity.status !== 'not-joined') {
    return res.status(400).json({ error: 'Activity is not available to join' });
  }

  activity.status = 'joined';
  activity.currentStep = 1;
  // Unlock first step
  if (activity.steps && activity.steps.length > 0) {
    activity.steps[0].locked = false;
  }

  res.json({ success: true, activity });
});

// ─── POST /api/activity/upload-evidence ──────────────────────────────────────
app.post('/api/activity/upload-evidence', upload.single('evidence'), (req, res) => {
  const { activityId, stepId } = req.body;

  if (!activityId || !stepId) {
    return res.status(400).json({ error: 'activityId and stepId are required' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const activity = activities.find((a) => a.id === activityId);
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  const step = activity.steps?.find((s) => s.id === stepId);
  if (!step) {
    return res.status(404).json({ error: 'Step not found' });
  }
  if (step.locked) {
    return res.status(403).json({ error: 'This step is locked' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  step.evidenceUrl = imageUrl;
  step.completed = true;

  // Unlock the next step if exists
  const stepIndex = activity.steps.indexOf(step);
  if (stepIndex + 1 < activity.steps.length) {
    activity.steps[stepIndex + 1].locked = false;
  }

  // Update currentStep
  const completedCount = activity.steps.filter((s) => s.completed).length;
  activity.currentStep = Math.min(completedCount + 1, activity.steps.length);

  // Add score
  const scorePerStep = 250;
  activity.currentScore = (activity.currentScore || 0) + scorePerStep;

  res.json({
    success: true,
    imageUrl,
    currentStep: activity.currentStep,
    currentScore: activity.currentScore,
  });
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`CC Order Center backend running on http://localhost:${PORT}`);
  console.log(`Uploads served from http://localhost:${PORT}/uploads`);
});
