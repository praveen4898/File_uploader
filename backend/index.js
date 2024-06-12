const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 4500;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://praveen:kumar@cluster0.bdcjvmr.mongodb.net/uploadedfiles?retryWrites=true&w=majority')
.then(() => console.log("connected to database"))
.catch((err) => console.error(" connection error:", err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  fileUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const File = mongoose.model('File', fileSchema);

app.post('/upload', upload.single('file'), async (req, res) => {
  const fileUrl = `http://localhost:4500/uploads/${req.file.filename}`;

  const newFile = new File({
    filename: req.file.filename,
    path: req.file.path,
    fileUrl: fileUrl
  });

  // Saving to database
  try {
    await newFile.save();
    res.json({ filePath: req.file.path, fileName: req.file.filename, fileUrl });
  } catch (error) {
    console.error("Error saving file to database:", error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
