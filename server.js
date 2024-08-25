const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbpath = path.join(__dirname, "studentsMentors.db");
app.use(cors());
app.use(express.json());

let db = null;

const initializeServerAndDatabase = async () => {
    try {
        db = await open({
            filename: dbpath,
            driver: sqlite3.Database
        });
        app.listen(3001, () => {
            console.log("Server running at port number 3001");
        });
    } catch (e) {
        console.error(`Error initializing server and database: ${e.message}`);
        process.exit(1);
    }
};

initializeServerAndDatabase();

app.post('/students', async (request, response) => {
    const { student_Name, area_of_intrest, availabilty } = request.body;
    const addStudentQuery = `
        INSERT INTO students (student_Name, area_of_intrest, availabilty)
        VALUES (?, ?, ?)`;

    try {
        await db.run(addStudentQuery, [student_Name, area_of_intrest, availabilty]);
        response.status(200).json({ message: "Student added successfully" });
    } catch (e) {
        response.status(400).json({ error: e.message });
    }
});

app.post('/mentors', async (request, response) => {
    const { mentor_Name, availability, area_of_expert, is_premium } = request.body;
    const addMentorQuery = `
        INSERT INTO mentors (mentor_Name, availability, area_of_expert, is_premium)
        VALUES (?, ?, ?, ?)`;

    try {
        await db.run(addMentorQuery, [mentor_Name, availability, area_of_expert, is_premium]);
        response.status(200).json({ message: "Mentor added successfully" });
    } catch (e) {
        response.status(400).json({ error: e.message });
    }
});

app.get('/mentors', async (request, response) => {
    const getData = `SELECT * FROM mentors`;

    try {
        const data = await db.all(getData);
        response.status(200).json(data);
    } catch (e) {
        response.status(400).json({ error: e.message });
    }
});

app.get('/mentors/:area_of_expert', async (request, response) => {
    const { area_of_expert } = request.params;
    const selectedDomain = `SELECT * FROM mentors WHERE area_of_expert = ?`;

    try {
        const mentors = await db.all(selectedDomain, [area_of_expert]);
        response.status(200).json(mentors);
    } catch (e) {
        response.status(400).json({ error: e.message });
    }
});
