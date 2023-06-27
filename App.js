const express = require("express")
const app = express()
const multer = require('multer');
const fs = require('fs');



const upload = multer({ dest: 'uploads/' });

const PORT = 3000

app.use(express.json())

const conn = require("./db/conn")
conn()

const routes = require("./routes/router")
app.use("/api", routes)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/page/index.html')
  })

  app.post('/', upload.single('htmlFile'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('Nenhum arquivo enviado.');
    }
  
    const filePath = req.file.path;
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send(err);
      }
  
      const lines = data.split('\n');
  
      const requests = [];
      const blocks = [];
      const cancellations = [];
  
      lines.forEach((line) => {
        line = line.trim();
  
        if (line.startsWith('01')) {
          requests.push(line);
        } else if (line.startsWith('02')) {
          blocks.push(line);
        } else if (line.startsWith('03')) {
          cancellations.push(line);
        }
      });

      exportData(requests, blocks, cancellations)
      module.exports = { exportData, requests, blocks, cancellations };
      
      console.log("Solicitações: ",requests,"\nBloqueios: ", blocks, "\nCancelamentos: ",cancellations);
  
      res.send('Uploaded file!');
    });
  });

  function exportData(reqs, blcks, cancels) {
    requests = reqs;
    blocks = blcks;
    cancellations = cancels;
  }
  
  
  
  app.listen(PORT, () => {
    console.log('Servidor on: http://localhost:3000');
  });