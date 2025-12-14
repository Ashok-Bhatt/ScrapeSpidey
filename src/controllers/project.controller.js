import Project from "../models/project.model.js";
import { v4 as uuid } from "uuid"
import mongoose from "mongoose";
import handleError from "../utils/errorHandler.js";

const getProjects = async (req, res) => {
    try {
        const userId = req.user._id;
        const projects = await Project.find({ userId }).sort({ createdAt: -1 }).select("-userId -__v");
        return res.status(200).json(projects);
    } catch (error) {
        return handleError(res, error, "Error in getProjects controller:");
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
        return handleError(res, error, "Error in getProjectById controller:");
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
        return handleError(res, error, "Error in createProject controller:");
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
        return handleError(res, error, "Error in updateProject controller:");
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
        return handleError(res, error, "Error in deleteProject controller:");
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
        return handleError(res, error, "Error occurred while changing he daily Api limit of the user");
    }
}

const getUserProjects = async (req, res) => {
    try {
        const { userId } = req.params;
        // Verify user exists if needed, but finding projects is sufficient
        const projects = await Project.find({ userId }).sort({ createdAt: -1 }).select("-userId -__v");
        return res.status(200).json(projects);
    } catch (error) {
        return handleError(res, error, "Error in getUserProjects controller:");
    }
};

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    changeDailyApiLimit,
    getUserProjects,
};