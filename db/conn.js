const mongoose = require("mongoose")

async function main(params) {
    try {
        mongoose.set("strictQuery", true)
        await mongoose.connect(
            "mongodb+srv://Cickruss:1KtsT3bl1xzwGg41@cluster0.zy8ucvc.mongodb.net/?retryWrites=true&w=majority"
        )
        console.log("Database connected!")
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}
module.exports = main