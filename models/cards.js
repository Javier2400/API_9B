import mongoose  from "mongoose";

const cardSchema = new mongoose.Schema(
    {
    name:{
        type: String,
        require: true,
        trim: true,
    },
    link:{
        type: String,
        require: true,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
    },
    like: {
        type: Number,
        default: 0,
    }
},
{
    timestamps: true,
}
);

export const Card = mongoose.model("Card", cardSchema);