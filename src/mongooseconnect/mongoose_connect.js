const mongoose=require('mongoose')
mongoose.connect((process.env.MONGO_CON+'Analytica'),{
    useNewUrlParser:true,
    useCreateIndex:true,
     useUnifiedTopology: true 
})
