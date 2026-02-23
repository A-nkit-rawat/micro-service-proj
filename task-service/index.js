const express = require("express");
const mongoose = require("mongoose");
const amqp = require('amqplib/callback_api')
require("dotenv/config")

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://mongodb/testing")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        userId: {
            type: String,
            required: [true, "userId is required"],
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
var queue="task-queue"
async function startQueue(message) {
    try {
        amqp.connect("amqp://rabbitmq-node/", (error, connection) => {
            if (error) {
                throw error;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error;
                }
                else {
                    channel.assertQueue(queue,{durable:false});
                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
                }
            });
            
        });
    }
    catch (e) {

    }


}

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/tasks", async (req, res) => {
    try {
        const { title, description, userId } = req.body;

        if (!title || !userId) {
            return res.status(400).json({
                success: false,
                message: "title and userId are required",
            });
        }
        const task = await Task.create({ title, description, userId });
        await startQueue(task)        

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages });
        }
        res.status(500).json({ success: false, message: err.message });
    }
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});