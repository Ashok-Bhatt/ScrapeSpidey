import Project from "../../models/project.model.js";
import { v4 as uuid } from "uuid"
import mongoose from "mongoose";
import { asyncHandler } from "../../utils/async-handler.util.js";

const getProjects = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const projects = await Project.find({ userId }).sort({ createdAt: -1 }).select("-userId -__v");
    return res.status(200).json(projects);
});

const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await Project.findOne({ _id: id, userId });

    if (!project) return res.status(404).json({ message: "Project not found." });

    return res.status(200).json(project);
});

const createProject = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name || name.trim() === "") return res.status(400).json({ message: "Project name is required." });

    const newProject = new Project({
        name,
        userId,
        apiKey: uuid(),
    });

    await newProject.save();

    return res.status(201).json(newProject);
});

const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    if (!name || name.trim() === "") return res.status(400).json({ message: "New project name is required." });

    const project = await Project.findOneAndUpdate(
        { _id: id, userId },
        { name },
        { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found or you do not have permission to update it." });

    return res.status(200).json(project);
});

const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await Project.findOneAndDelete({ _id: id, userId });

    if (!project) return res.status(404).json({ message: "Project not found or you do not have permission to delete it." });

    return res.status(200).json({ message: "Project deleted successfully", deletedProject: project });
});

const changeDailyApiLimit = asyncHandler(async (req, res) => {
    const { projectId, newApiPointsDailyLimit } = req.body;

    if (!projectId) return res.status(400).json({ message: "Project Id not provided!" });
    if (!newApiPointsDailyLimit) return res.status(400).json({ message: "API Limit not provided!" });

    const project = await Project.findById(new mongoose.Types.ObjectId(projectId));
    if (!project) return res.status(404).json({ message: "Project not found!" });

    project.apiPointsDailyLimit = newApiPointsDailyLimit;
    await project.save();

    return res.status(200).json({ message: "Daily API Points Limit Changed!" });
});

const getUserProjects = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // Verify user exists if needed, but finding projects is sufficient
    const projects = await Project.find({ userId }).sort({ createdAt: -1 }).select("-userId -__v");
    return res.status(200).json(projects);
});

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    changeDailyApiLimit,
    getUserProjects,
};
