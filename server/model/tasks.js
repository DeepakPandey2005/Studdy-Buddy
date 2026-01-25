const mongoose=require('mongoose');


const stepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});



const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
      steps: {
      type: [stepSchema], // 🔥 array of steps
      default: [],
    },
    status:{
        type:String,
        enum:['pending','completed'],
        default:'pending'
    },
    dueDate:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

exports.Task=mongoose.model.Task || mongoose.model('Task',taskSchema);