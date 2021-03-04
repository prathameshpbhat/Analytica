const mongoose=require('mongoose')
console.log(process.env.MONGO_CON)
mongoose.connect((process.env.MONGO_CON),{
    useNewUrlParser:true,
    useCreateIndex:true,
     useUnifiedTopology: true 
})
