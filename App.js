const express = require("express")
const app = express()
const multer = require('multer');
const fs = require('fs');

const { Request: RequestModel } = require("./models/Process")
const { Block: BlockModel } = require("./models/Process")
const { Cancellation: CancellationModel } = require("./models/Process")
const {Account: AccountModel} = require("./models/Account")

const upload = multer({ dest: 'uploads/' });

const PORT = 3000

app.use(express.json())

const conn = require("./db/conn")
conn()

let errorsFile = ''

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
      const header = '';
      const requests = new Array
      const blocks = new Array
      const cancellations = new Array
      const trailer = ''

      
      TreatFile(data, requests, blocks, cancellations)

      ProcessRequests(requests)
      ProcessBlocks(blocks)
      ProcessCancellations(cancellations)
      

      res.redirect("/download") 
    });
  });

  app.get("/download", (req, res) => {
    res.send(header)
  })

  function TreatFile(data, requests, blocks, cancellations) {
    const lines = data.split('\n');
  
    for (let line of lines) {
        line = line.trim()
        if (line.startsWith('00')) {
          header = line
        } else if (line.startsWith('01')) {
          requests.push(line)
        } else if (line.startsWith('02')) {
          blocks.push(line)
        } else if (line.startsWith('03')) {
          cancellations.push(line)
        } else if (line.startsWith('99')){
          trailer = line
          break;
        }
      }
  }


  async function ProcessRequests(requests) {
    for (let i = 0; i < requests.length; i++) {
        const partsJson = SplitRequestString(requests[i])
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
      
      const partsJson = SplitBlockOrCancellationsString(blocks[i])
      if (partsJson == 1){
        console.log("rompeu o loop");
        continue
        
      } 
      console.log("partes: ", partsJson)
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
      const partsJson = SplitBlockOrCancellationsString(cancellations[i])
      console.log(partsJson)
      try {
        const response = await CancellationModel.create(partsJson)
        console.log("Cancellations uploaded in db!")
      } catch (error) {
        console.log(error)
      }
  }
  }


  function SplitRequestString(requestString) {
    const partsLengths = [2, 8, 6, 4, 12, 11, -1, 2, 8];
    const parts = [];
    let startIndex = 0;
  
    for (let i = 0; i < partsLengths.length; i++) {
      const partLength = partsLengths[i];
      
      if (partLength === -1) {

        const regex = /[a-zA-Z\s]/g;
        const matches = requestString.match(regex)
        const characters = matches.join('')
        parts.push(characters.trim());
        requestString = requestString.replace(regex, '')
      }
      else{
        const part = requestString.substr(startIndex, partLength)
        parts.push(part)
      }
      
      startIndex += partLength;
    }

    const partsJson = {
      "type" : parseInt(parts[0]),
      "date" : parseInt(parts[1]),
      "id" : parseInt(parts[2]),
      "agency" : parseInt(parts[3]),
      "account" : parseInt(parts[4]),
      "cpf" : parseInt(parts[5]),
      "name" : parts[6],
      "nameForCard" : CreateNameForCard(parts[6]),
      "dueDate" : parseInt(parts[7]),
      "password" : parseInt(parts[8]),
    }
    console.log("JSON: ", partsJson)
    return partsJson
  }
  function SplitBlockOrCancellationsString(blockOrCancallationsStrings) {
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
      "type" : parseInt(parts[0]) ,
      "date" : parseInt(parts[1]),
      "id" : parseInt(parts[2]),
      "agency" : parseInt(parts[3]),
      "account" : parseInt(parts[4]),
      "motive" : parseInt(parts[5]),
      "idAction" : parseInt(parts[6]),
    }

    if (partsJson.type === 2) {
      const error = ValidateAccountAndAgency(partsJson.type, partsJson.date, partsJson.id, partsJson.account, partsJson.agency)
      if (error !== 0) {
        return 1
      }
      return partsJson

    }else if (partsJson.type === 3) {

      

      return partsJson;
    }

  }
  
  
  async function ValidateAccountAndAgency(type, date, id, account, agency) {
    var error = 0
    try {
      const accountInDatabase = await AccountModel.findOne({ account })
      if (!accountInDatabase) {
        error = 1
        console.log(error,"account not exist")
      } else if (accountInDatabase.agency !== agency) {
        error = 2
        console.log(error, "agency incorrect");
      }

      if (error !== 0) {
        let lineError = type.toString()
        lineError += date.toString() + id.toString() + error.toString() + '\n'
        errorsFile += lineError
        console.log(errorsFile);
        return 1
      }
      return 0
    } catch (error) {
      console.log(error)
    }
    
  }

  /*async function ValidateStateforBlock(account) {
    var lineError = 0
    const accountInDatabase = await AccountModel.findOne({ account })
    if (!(accountInDatabase.state === "actived")) {
      lineError = 3
      console.log(lineError)
      return
    }
    return
  }*/

  function CreateNameForCard(name) {
    const names = name.split(' ')
    const firstName = names[0]
    const lastName = names[names.length - 1]
    const nameForCard = firstName + ' ' + lastName

    return nameForCard
  }

  app.listen(PORT, () => {
    console.log('Servidor on: http://localhost:3000');
  });