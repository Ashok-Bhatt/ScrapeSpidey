import Project from "../models/project.model.js";
import { v4 as uuid } from "uuid"
import mongoose from "mongoose";

const getProjects = async (req, res) => {
    try {
        const userId = req.user._id;
        const projects = await Project.find({ userId }).sort({ createdAt: -1 }).select("-userId -__v");
        return res.status(200).json(projects);
    } catch (error) {
        console.error("Error in getProjects controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error while fetching projects." });
    }
};

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const project = await Project.findOne({ _id: id, userId });

        if (!project) return res.status(404).json({ message: "Project not found." });

        return res.status(200).json(project);
    } catch (error) {
        console.error("Error in getProjectById controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error while fetching project." });
    }
};

const createProject = async (req, res) => {
    try {
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
    } catch (error) {
        console.error("Error in createProject controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error while creating project." });
    }
};

const updateProject = async (req, res) => {
    try {
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
    } catch (error) {
        console.error("Error in updateProject controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error while updating project." });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const project = await Project.findOneAndDelete({ _id: id, userId });

        if (!project) return res.status(404).json({ message: "Project not found or you do not have permission to delete it." });

        return res.status(200).json({ message: "Project deleted successfully", deletedProject: project });
    } catch (error) {
        console.error("Error in deleteProject controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error while deleting project." });
    }
};

const changeDailyApiLimit = async (req, res) => {
    try {
        const { projectId, newApiPointsDailyLimit } = req.body;

        if (!projectId) return res.status(400).json({ message: "User Id not provided!" });
        if (!newApiPointsDailyLimit) return res.status(400).json({ message: "API Limit not provided!" });

        const project = await Project.findById(new mongoose.Types.ObjectId(projectId));
        if (!project) return res.status(404).json({ message: "Project not found!" });

        project.apiPointsDailyLimit = newApiPointsDailyLimit;
        await project.save();

        return res.status(200).json({ message: "Daily API Points Limit Changed!" });
    } catch (error) {
        console.log("Error occurred while changing he daily Api limit of the user");
        console.log(error.stack);
        return res.status(500).json({ message: "Something went wrong while changing Daily API Points Limit!" });
    }
}

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    changeDailyApiLimit,
};