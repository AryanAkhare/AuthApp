const mongoose=require("mongoose")

require("dotenv").config()

exports.connectDB=()=>{
    mongoose.connect(process.env.DATABASE_URL).then(()=>{
        console.log("connected successfully")
    }).catch((e)=>{
        console.log("connection issue")
        console.error(e)
        process.exit(1)
    })
}

