const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Question = require("./Question");


const AnswerSchema = new Schema({

    content:{
        type: String,
        required: [true, "please provide a content"],
        minlength: [10, "please provide a title at least 10 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes:[
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    question : {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Question"
    }
});

AnswerSchema.pre("save", async function(next){

    if(!this.isModified("user")) return next();

    try {
        const question = await Question.findById(this.question);

        question.answers.push(this._id);
        question.answerCount = question.answers.length;
        await question.save();
        next();
    } catch (error) {
        return next(error);
    }
});


module.exports = mongoose.model("Answer", AnswerSchema);
