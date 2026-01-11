require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const connectDB = require('./config/db');
const PORT=process.env.PORT||3000;
const userRoutes=require('./routes/User');

app.use(cors())
connectDB();


app.get('/',(req,res)=>{
    res.send('Hello World!');
});

// routes 

app.use('/api/users',userRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})