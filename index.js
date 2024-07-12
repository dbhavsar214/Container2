const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { log } = require('console');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 6001;
const FILE_DIRECTORY = process.env.FILE_DIRECTORY || '/divy_PV_dir';

// Ensure the directory exists
if (!fs.existsSync(FILE_DIRECTORY)) {
  fs.mkdirSync(FILE_DIRECTORY, { recursive: true });
}

app.post('/calculate', (req, res) => {
  console.log("res", res);
  const { file, product } = req.body;

  if (!file) {
    return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
  }

  const filePath = path.resolve(FILE_DIRECTORY, file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ file, error: 'File not found.' });
  }

  let sum = 0;
  let isValidCSV = true;
  //container2
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.product === product) {
        sum += parseInt(row[' amount '], 10);
      }
    })
    .on('error', (err) => {
      isValidCSV = false;
      console.error(err);
      res.status(400).json({ "file": file, "error": "Input file not in CSV format." });
    })
    .on('end', () => {
      if (isValidCSV) {
        res.json({ "file": file, "sum": sum });
      }
    });
});

app.listen(PORT, () => {
  console.log(`Processor running on port ${PORT}`);
});
