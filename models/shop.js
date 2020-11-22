const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const shopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        description:{
          type: String,
          trim: true,
          required: true,
          maxlength: 1000
        },
        user: {
            type: ObjectId,
            ref: "User",
            required: true,
            unique:true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);
