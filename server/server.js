require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const connectDB = require('./config/db');
const PORT=process.env.PORT||3000;
const userRoutes=require('./routes/User');
const aiRoutes=require('./routes/ai');
const taskRoutes=require('./routes/tasks');

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());
connectDB();


app.get('/',(req,res)=>{
    res.send('Hello World!');
});

// routes 

app.use('/api/users',userRoutes);
app.use('/api/generate',aiRoutes)
app.use('/api/tasks',taskRoutes);

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})