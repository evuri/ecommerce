const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },

        category: {
           id:{
              type: ObjectId,
              ref: "Category",
              required: true
            },
            name:{
              type: String,
              trim: true,
              required: true,
              maxlength: 32,
            }
        },
        shop: {
          id:{
            type: ObjectId,
            ref: "Shop",
            required: true
          },
          name:{
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
          }
        },
        quantity: {
            type: Number
        },
        sold: {
            type: Number,
            default: 0
        },
        photo: {
          img1:{
              data: Buffer,
              contentType: String
          },
          img2:{
              data: Buffer,
              contentType: String
          },
          img3:{
              data: Buffer,
              contentType: String
          },
          img4:{
              data: Buffer,
              contentType: String
          },
          img5:{
              data: Buffer,
              contentType: String
          }
        },
        numberPics:{
          type: Number,
          default: 1
        },
        shipping: {
            required: false,
            type: Boolean
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
