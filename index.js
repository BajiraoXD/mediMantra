const express = require('express');
const mongoose = require("mongoose");
const multer = require('multer');
const connect = mongoose.connect("mongodb+srv://nilaysharma2002:Nilay%4002@medi-mantra.ketkjri.mongodb.net/login-tut");
const router = express.Router();

connect.then(() => {
    console.log("DB connected successfully!");
}).catch((error) => {
    console.error("DB connection error:", error);
});

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
    doctorId: {
        type: String,
        required: true
    }
});
const appointmentSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true
    }

    // You can add more fields like timestamp, user details, etc., if needed
});
const fileSchema = new mongoose.Schema({
    filename: String,
    path: String
});
const docS = new mongoose.Schema({
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
    }

});
const File = mongoose.model('File', fileSchema);
const User = mongoose.model("users", LoginSchema);
const Doctor = mongoose.model("doctor", DocSchema);
const Appointment = mongoose.model('appointments', appointmentSchema);
const DocApp = mongoose.model('nilay', docS);
module.exports = { User, Doctor, Appointment, File, DocApp };


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use('/api', router);


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/docLog", (req, res) => {
    res.render("docLog");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/dashboard-user", (req, res) => {
    res.render("dashboard-user");
});
app.get("/dashboard-user", async (req, res) => {

    const doc = await Appointment.findOne().sort()({ createdAt: -1 });
    console.log(doc);
    const AppName = doc['doctorName'];
    res.render("dashboard-user", { 'AppName': "Akash" });
});



app.get("/dashboard-doc", (req, res) => {
    res.render("dashboard-doc");
});

app.get("/docSign", (req, res) => {
    res.render("docSign");
});
router.post("/appointment", async (req, res) => {
    try {
        const { doctorId } = req.body;

        // Fetch details of the doctor from the Doctor collection
        const doctor = await Doctor.findById(doctorId);

        // Extract the name of the doctor
        const doctorName = doctor ? doctor.name : "Unknown Doctor";

        // Create a new document in the Appointment collection
        const appointment = new Appointment({ doctorName });
        await appointment.save();

        // Send a success response
        res.send({ doctorName });
        console.log(doctorName);
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).send("An error occurred while booking appointment.");
    }
});



module.exports = router;

app.get("/profle", async (req, res) => {
    try {
        const email = email1;
        const user = await User.find({ email: email });
        console.log(user);
        console.log(email);
        const n = user[0]['name'];
        const e = user[0]['email'];
        const a = user[0]['age'];
        if (user) {
            res.render("profle", { 'name': n, 'email': e, 'age': a });
        } else {
            res.send("User not found!");
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send("An error occurred while fetching user profile.");
    }
});


app.get("/doc-profile", async (req, res) => {
    try {
        const email = email2;
        const user = await Doctor.find({ email: email });
        console.log(user);
        console.log(email);
        const n = user[0]['name'];
        const e = user[0]['email'];
        const a = user[0]['age'];
        const d = user[0]['doctorId'];
        if (user) {
            res.render("doc-profile", { 'name': n, 'email': e, 'age': a, 'doctorId': d });
        } else {
            res.send("User not found!");
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send("An error occurred while fetching user profile.");
    }
});
app.get("/doctor-appointment", async (req, res) => {
    try {
        console.log(DocApp)
        const docs = await DocApp.findOne(); // Retrieve only the 'name' field
        // const names = docs.map(doc => doc.name); // Extract the 'name' field from each document
        const names = ['NILAY'];
        res.render("doctor-appointment", { names });

    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        res.status(500).send("An error occurred while fetching doctor appointments.");
    }
});




app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        email1 = email;
        const doc = await Appointment.findOne().sort({ _id: -1 });
        console.log(doc);
        const AppName = doc['doctorName'];
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.send("Account not found!");
        }

        const passwordMatch = await User.findOne({ password: password });
        if (!passwordMatch) {
            return res.send("Incorrect password! Please try again.");
        }
        const record = await User.findOne({ email: email });
        const userName = record['name'];
        res.render("dashboard-user", { 'userName': userName, 'AppName': AppName });
    } catch (error) {
        console.error("Error during login:", error);
        res.send("An error occurred during login.");
    }
});

app.post("/signup", async (req, res) => {
    try {
        const { name, age, email, password } = req.body;
        const newUser = new User({
            name,
            age,
            email,
            password
        });
        await newUser.save();
        res.send("User signed up successfully!");
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("An error occurred during signup.");
    }
});

app.post('/docSign', (req, res) => {
    const { name, age, email, password, doctorId } = req.body;
    const newDoctor = new Doctor({
        name,
        age,
        email,
        password,
        doctorId
    });
    newDoctor.save()
        .then(doctor => {
            res.status(200).send('Doctor signup successful!');
        })
        .catch(err => {
            res.status(500).send('Doctor signup failed. Please try again later.');
        });
});
app.post("/docLog", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        email2 = email;
        const user = await Doctor.findOne({ email: email });
        if (!user) {
            return res.send("Account not found!");
        }

        const passwordMatch = await Doctor.findOne({ password: password });
        if (!passwordMatch) {
            return res.send("Incorrect password! Please try again.");
        }
        const record = await Doctor.findOne({ email: email2 });
        console.log(record);
        const userName = record['name'];

        res.render("dashboard-doc", { 'userName1': userName });

    } catch (error) {
        console.error("Error during login:", error);
        res.send("An error occurred during login.");
    }
});
app.get("/appointment", async (req, res) => {
    try {
        // Fetch all doctors from the database
        const doctors = await Doctor.find({});
        res.render("appointment", { doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).send("An error occurred while fetching doctors.");
    }
});

// POST route to book an appointment
// Handle the POST request to book an appointment
app.post("/book-appointment", async (req, res) => {
    try {
        const { doctorId } = req.body;

        // Fetch details of the doctor from the Doctor collection
        const doctor = await Doctor.findById(doctorId);

        // Extract the name of the doctor
        const doctorName = doctor ? doctor.name : "Unknown Doctor";

        // Create a new document in the Appointment collection
        const appointment = new Appointment({ doctorName });
        await appointment.save();

    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).send("An error occurred while booking appointment.");
    }
});
app.get('/user-report', (req, res) => {
    res.render('user-report');
});
// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload'); // Store uploads in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep original filename
    }
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    const { filename, path } = req.file;
    const newFile = new File({ filename, path });
    await newFile.save();
    res.redirect('/user-report');
});

// Download endpoint
app.get('/download/:filename', async (req, res) => {
    const { filename } = req.params;
    const file = await File.findOne({ filename });
    if (!file) {
        return res.status(404).send('File not found');
    }
    res.download(file.path); // Download file
});

// Route for user-report page
app.get('/user-report', (req, res) => {
    res.render('user-report.ejs');
});

// Route for doctor-report page
app.get('/doctor-report', async (req, res) => {
    const files = await File.find({});
    res.render('doctor-report.ejs', { files });
});








const port = 3000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
