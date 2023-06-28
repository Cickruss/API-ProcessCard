const express = require("express")
const app = express()
const multer = require('multer');
const fs = require('fs');

const { Request: RequestModel } = require("./models/Process")
const { Block: BlockModel } = require("./models/Process")
const { Cancellation: CancellationModel } = require("./models/Process")

const upload = multer({ dest: 'uploads/' });

const PORT = 3000

app.use(express.json())

const conn = require("./db/conn")
conn()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/page/index.html')
  })

app.post('/', upload.single('htmlFile'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('File not found!');
    }
  
    const filePath = req.file.path;
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send(err);
      }
      
      const requests = [];
      const blocks = [];
      const cancellations = [];
      
      treatFile(data, requests, blocks, cancellations)

      console.log(requests,"\n",blocks,"\n",cancellations,"\n")

      ProcessRequests(requests)
      //ProcessBlocks(blocks)
      //ProcessCancellations(cancellations)


      res.send("uploaded files!") 
    });
  });

  function treatFile(data, requests, blocks, cancellations) {
    const lines = data.split('\n');
  
      lines.forEach((line) => {
        line = line.toString().replace(/\s/g, '')
  
        if (line.startsWith('01')) {
          requests.push(line)
        } else if (line.startsWith('02')) {
          blocks.push(line)
        } else if (line.startsWith('03')) {
          cancellations.push(line)
        }
      })
  }

  async function ProcessRequests(requests) {
    for (let i = 0; i < requests.length; i++) {
        const partsJson = splitRequestString(requests[i])
        console.log(partsJson)
      try {
        const response = await RequestModel.create(partsJson)
        console.log("Requests uploaded in db!")
      } catch (error) {
        console.log(error)
      }
    }
    
}
  async function ProcessBlocks(blocks) {
    for (let i = 0; i < blocks.length; i++) {
      const partsJson = splitBlockOrCancellationsString(blocks[i])
      console.log(partsJson)
      try {
        const response = await BlockModel.create(partsJson)
        console.log("Blocks uploaded in db!")
      } catch (error) {
        console.log(error)
      }
      
  }
  }
  async function ProcessCancellations(cancellations) {
    for (let i = 0; i < cancellations.length; i++) {
      const partsJson = splitBlockOrCancellationsString(cancellations[i])
      console.log(partsJson)
      try {
        const response = await CancellationModel.create(partsJson)
        console.log("Cancellations uploaded in db!")
      } catch (error) {
        console.log(error)
      }
  }
  }

  function splitRequestString(requestString) {
    const partsLengths = [2, 8, 6, 4, 12, 11, -1, 2, 8];
    const parts = [];
  
    let startIndex = 0;
  
    for (let i = 0; i < partsLengths.length; i++) {
      const partLength = partsLengths[i];

      if (partLength === -1) {

        const regex = /[^a-zA-Z]/g;
        const matches = requestString.match(regex);
        const characters = matches ? matches.join('') : '';
        const result = requestString.replace(regex, '');
        parts.push(characters);
      }
      else{
        const part = requestString.substr(startIndex, partLength);
        parts.push(part);
      }
      
      startIndex += partLength;
    }
    
    const partsJson = {
      "type" : parts[0],
      "date" : parts[1],
      "id" : parts[2],
      "agency" : parts[3],
      "account" : parts[4],
      "cpf" : parts[5],
      "name" : parts[6],
      "dueDate" : parts[7],
      "password" : parts[8],
    }
    return partsJson
  }

  function splitBlockOrCancellationsString(blockOrCancallationsStrings) {
    const partsLengths = [2, 8, 6, 4, 12, 2, 6];
    const parts = [];
  
    let startIndex = 0;
  
    for (let i = 0; i < partsLengths.length; i++) {
      const partLength = partsLengths[i];
      const part = blockOrCancallationsStrings.substr(startIndex, partLength);
      parts.push(part);
      startIndex += partLength;
    }
    
    const partsJson = {
      "type" : parts[0],
      "date" : parts[1],
      "id" : parts[2],
      "agency" : parts[3],
      "account" : parts[4],
      "motive" : parts[5],
      "idAction" : parts[6],
    }
    return partsJson;
  }
  
  
  
  app.listen(PORT, () => {
    console.log('Servidor on: http://localhost:3000');
  });