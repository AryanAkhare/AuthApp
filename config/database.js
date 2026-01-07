const mongoose=require("mongoose")

require("dotenv").config()

exports.connectDB=()=>{
    if(!process.env.DATABASE_URL){
        console.warn("DATABASE_URL not set — skipping DB connection (dev only)");
        return;
    }

    mongoose.connect(process.env.DATABASE_URL).then(()=>{
        console.log("connected successfully")
    }).catch((e)=>{
        console.log("connection issue")
        console.error(e)
        process.exit(1)
    })
}

