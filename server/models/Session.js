import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({
     title: {
    type: String,
    required: true,
  },
   tags: {
    type: [String],
    required: true,
  },
   fileUrl: {
    type: String,
    required: true,
  },
  creater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
  ],
  status: {
  type: String,
  enum: ['Publish', 'Draft'], 
  default: 'Draft',
  required: true,
},
 description: {
    type: String,
    required: true,
  },


},{
    timestamps:true,
});

const Session = mongoose.model('Session',sessionSchema);

export default Session;