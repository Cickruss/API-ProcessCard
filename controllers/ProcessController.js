const { Request: RequestModel } = require("../models/Process")

const { requests, blocks, cancellations, exportData } = require('../App');

    const processController = {
        create: async(req,res) => {
            try {
                /*const request = {
                    type: null,
                    date: null,
                    id: null,
                    agency: null,
                    account: null,
                    cpf: null,
                    name: null,
                    nameForCard: null,
                    dueDate: null,
                    password: null,
                }

                const response = await RequestModel.create(request)*/

                console.log("Solicitações: ",requests,"\nBloqueios: ", blocks, "\nCancelamentos: ",cancellations);
            } catch (error) {
                console.log(error)
                res.json({msg: error})
            }
        }
    }

module.exports = requestController