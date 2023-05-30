// const express = require("express");
import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv' 
dotenv.config()

console.log(process.env);

const app = express();

const PORT = process.env.PORT;

const details = [
    {
    "id": "1",
    "studentId": "1",
    "mentorId": "1",
    "student": "Koushik",
    "mentor": "Koushik"
    },
    {
      "id": "2",
      "studentId": "1",
      "mentorId": "1",
      "student": "Koushik",
      "mentor": "Koushik"
      },
      {
        "id": "3",
        "studentId": "1",
        "mentorId": "1",
        "student": "Koushik",
        "mentor": "Koushik"
        },
        {
          "id": "4",
          "studentId": "1",
          "mentorId": "1",
          "student": "Koushik",
          "mentor": "Koushik"
          },
          {
            "id": "5",
            "studentId": "1",
            "mentorId": "1",
            "student": "Koushik",
            "mentor": "Koushik"
            },
            {
              "id": "6",
              "studentId": "1",
              "mentorId": "1",
              "student": "Koushik",
              "mentor": "Koushik"
              },
    ]

// const MONGO_URL = "mongodb://127.0.0.1";
const MONGO_URL = process.env.MONGO_URL; 
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Mongo is connected")    

app.use(express.json());

app.get("/", function (request, response) {
  response.send("Welcome to Student-Mentor App");
});

app.post("/mentors", async function (request, response) {
    // const mentor = req.body;
    const mentor = await client.db("stumen").collection("details").insertOne(mentor);
    response.send(mentor);
  });

app.post("/students", async function (request, response) {
    const students = await client.db("stumen").collection("details").insertOne(student);
    response.send(students);
  });  

// Assign a Student to a Mentor
app.put("/mentors/assign/student", async function (req, res) {
  try {
    const { mentorId, studentId } = req.params;


    const db = client.db("stumen");

    const mentor = await client.db.collection("details").findOne({ mentorId });
    if (!mentor) {
      res.status(404).json({ error: 'Mentor not found' });
      return;
    }

    const student = await db.collection("details").findOne({ _id: mongodb.ObjectId(studentId) });
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    if (student.mentor) {
      res.status(400).json({ error: 'Student already assigned to a mentor' });
      return;
    }

    await db.collection("details").updateOne({ _id: mongodb.ObjectId(studentId) }, { $set: { mentor: mentorId } });

    res.json({ message: 'Student assigned to mentor successfully' });
    client.close();
  } catch (error) {
    res.status(500).json({ error: 'Error assigning multiple to mentor' });
  }
});  


// Select one Mentor and Add multiple Students
app.put("/mentors/assign/students/multiple", async function (req, res) {
  try {
    const { mentorId } = req.params;
    const { studentIds } = req.body;


    const db = client.db("stumen");

    const mentor = await db.collection("details").findOne({ _id: mongodb.ObjectId(mentorId) });
    if (!mentor) {
      res.status(404).json({ error: 'Mentor not found' });
      return;
    }

    const students = await db.collection("details").find({ _id: { $in: studentIds.map(id => mongodb.ObjectId(id)) }, mentor: { $exists: false } }).toArray();
    if (students.length !== studentIds.length) {
      res.status(400).json({ error: 'One or more students are already assigned to a mentor' });
      return;
    }

    await db.collection("details").updateMany({ _id: { $in: studentIds.map(id => mongodb.ObjectId(id)) } }, { $set: { mentor: mentorId } });

    res.json({ message: 'Students assigned to mentor successfully' });
    client.close();
  } catch (error) {
    res.status(500).json({ error: 'Error assigning multiple students to mentor' });
  }
});


// Assign or Change Mentor for a particular Student
app.put("/students/particular/mentor", async function (req, res) {
  try {
    const { studentId, mentorId } = req.params;

  
    const db = client.db("stumen");

    const student = await db.collection("details").findOne({ _id: mongodb.ObjectId(studentId) });
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const mentor = await db.collection("details").findOne({ _id: mongodb.ObjectId(mentorId) });
    if (!mentor) {
      res.status(404).json({ error: 'Mentor not found' });
      return;
    }

    await db.collection("details").updateOne({ _id: mongodb.ObjectId(studentId) }, { $set: { mentor: mentorId } });

    res.json({ message: 'Mentor assigned to student successfully' });
    client.close();
  } catch (error) {
    res.status(500).json({ error: 'Error assigning mentor to student' });
  }
});

// Show all students for a particular Mentor
app.get("/mentors/particular/students", async function (req, res) {
  try {
    const { mentorId } = req.params;


    const db = client.db("stumen");

    const mentor = await db.collection("details").findOne({ _id: mongodb.ObjectId(mentorId) });
    if (!mentor) {
      res.status(404).json({ error: 'Mentor not found' });
      return;
    }

    const students = await db.collection("details").find({ mentor: mentorId }).toArray();
    res.json(students);
    client.close();
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving students for mentor' });
  }
});

// Show previously assigned mentor for a particular Student
app.get("/students/previous/mentor", async function (req, res) {
  try {
    const { studentId } = req.params;


    const db = client.db("stumen");

    const student = await db.collection("details").findOne({ _id: mongodb.ObjectId(studentId) });
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    if (!student.mentor) {
      res.status(404).json({ error: 'Student does not have a mentor' });
      return;
    }

    const mentor = await db.collection("details").findOne({ _id: mongodb.ObjectId(student.mentor) });
    res.json(mentor);
    client.close();
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving previously assigned mentor' });
  }
});


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
