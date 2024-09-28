const mongoose = require("mongoose");
const PatientSchema = new mongoose.Schema({
    id :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
        unique: true
    },
    coupons:{
        type: [{
            coupon_name :{
                // type: mongoose.Schema.Types.ObjectId,
                // ref: "Coupon"
            },
            // set the expiry to 30 days after it is entered

            expriesOn:{
                type:Date
            }
        }],
    },
    couponsUsed:{
        type:Number,
    },
    favouriteDoctor:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }],
    amountSpent:{
        type:Number,
        default: 0,
        required:true
    },
    subscription:{
        type:String,
    },
    therapyType:{
        type:String,
        enum : [Individual, Couple, Teen],
    }

}, {
    timestamps: true// created_At, and uopdated_At
});

module.exports = mongoose.model("Patient", PatientSchema)