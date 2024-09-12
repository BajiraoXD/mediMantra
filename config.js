const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://nilaysharma2002:Nilay%4002@medi-mantra.ketkjri.mongodb.net/login-tut");

// Check if the database connected successfully or not
connect.then(() => {
    console.log("DB connected successfully!");
}).catch((error) => {
    console.error("DB connection error:", error);
});

// Create a schema
const LoginSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },

    email: {

        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

});

const DocSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },

    email: {

        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    DocID: {
        type: String,
        required: true
    }
});


const collection = mongoose.model("users", LoginSchema);

module.exports = collection;

const Doctors = mongoose.model("doctor", DocSchema);

module.exports = Doctors;
