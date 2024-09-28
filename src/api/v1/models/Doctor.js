const mongoose = require("mongoose");
const DoctorSchema = new mongoose.Schema({
    id :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
        unique: true
    },
    mainSpecialization:{
        type:String,
        required:true
    },
    experience:{
        type:Number,
        required:true
    },
    specialization: [{
        type:String,
        required:true
    }],
    education:{
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
        required:true
    },
    clinicAddress:{
        type: String,
    },
    registrationNumber:{
        type:String,
        required:true
    },
    registrationCouncil:{
        type:String,
        required:true
    },
    registrationYear:{
        type:Number,
        required:true
    },
    identityProof:{//what should be the json inside
        type: [{
            documentType: {
                // type: mongoose.Schema.Types.ObjectId,
                // ref: "Coupon"
            },

            // set the expiry to 30 days after it is entered
            documentFile: {
                type:Date
            }
        }],
        required:true
    },
    profileQuestions:[{
        type:String,
        trim: true
    }],
    patientsHandled: {
        type: Number,
        default : 0,
        required:true,
        trim: true
    },
    isApproved: {
        type: Boolean,
        default: false,
        required:true,
        trim: true
    },
    price: {
        type: Number,
        required:true,
        trim: true
    },
    discountOn3Sessions: {
        type: Number,
        trim: true
    },
    discountOn5Sessions: {
        type: Number,
        trim: true
    },
    totalEarnings :{
        type: Number,
        defrault: 0,
        required:true,
        trim: true
    },
    bilingCalendar: {
        type: String
    },
    balance :{
        type: Number,
        trim: true
    },
    rescheduleFee :{
        type: Number,
        trim: true
    },
    totalRescheduleAppointment :{
        type: Number,
        trim: true
    },
    reschedulePenaltiesSum :{
        type: Number,
        trim: true
    },
    refundAmountSum :{
        type: Number,
        trim: true
    },
    rating :{
        type: Number,
        trim: true
    },
    reviews :[{
        type: Number,
        trim: true
    }],
}, {
    timestamps: true// created_At, and uopdated_At
});

module.exports = mongoose.model("Doctor", DoctorSchema);