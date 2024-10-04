const mongoose = require("mongoose");
 
const DoctorSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    main_specialization:{
        type:String,
        require:[true, "main specialization is needed for creating the profile"]
    },
    //this will be used as tags in the frontend.
    expertise:{
        type:[String],
        default:[],
        require:[true, "please select at least 5 expertise"]
    },
    experience:{
        type:Number,
        require:[true, "please enter the experience in years"]
    },
    education:[{
        degree:{
            type:String,
            require:true
        },
        university:{
            type:String,
            require:true
        },
        year:{
            type:Number,
            require:true
        },
        file_url:{
            type:String,
            require:true
        }
    }],
    clinic_address_complete:{
        type:String,
        require:[true,  "please enter the complete address of the clinic"],
 
    },
    clinic_phone:{
        type:String,
        require:[true,  "please enter the phone number of the clinic"],
 
    },
    registration_number:{
        type:String,
        require:[true, "please enter the registration/license number"],
 
    },
    registration_council:{
        type:String,
        require:[true, "council name is needed for creating the profile"]
    },
    registration_year:{
        type:Number,
        require:[true, "Please provide the registration year"]
    },
    identity_proof:{
        file_type:{
            type:String,
            require:true
        },
        file_url:{
            type:String,
            require:true
        },
    },
    isApproved:{
        type:Boolean,
        default:false,
    },
    profile_questions:[{
        question_number:{
            type:Number,
        },
        answer:{
            type:String,
        },
    }],
    total_patients_handled:{
        type:Number,
        default:0
    },
    total_earnings:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:0
    },
    discount_on_3_appointments:{
        type: Number,
        default: 5
    },
    discount_on_5_appointments:{
        type: Number,
        default: 8
    },
    total_appointments:{
        type:Number,
        default:0
    },
    total_rescheduled_appointments:{
        type:Number,
        default:0
    },
    total_appointments_cancelled:{
        type:Number,
        default:0
    },
    total_appointments_completed:{
        type:Number,
        default:0
    },
    total_rescheduled_fee:{
        type:Number,
        default: 0,
    },
    total_refund_sum:{
        type:Number,
        default:0
    },
    rating:{
        type:Number,
        default:0
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
 
},{
    timestamps:true
});
 
DoctorSchema.index({ id: 1 });  // Index for doctor by user ID
DoctorSchema.index({ main_specialization: 1 });  // Search by specialization
DoctorSchema.index({ isApproved: 1 });  // To quickly find approved or unapproved doctors
DoctorSchema.index({ total_appointments_completed: -1 });  // Sort doctors by completed appointments
DoctorSchema.index({ rating: -1 });  // Sort by doctor ratings
DoctorSchema.index({ expertise: 1 });  // Indexing expertise for faster queries
 
module.exports = mongoose.model("Doctor",  DoctorSchema);