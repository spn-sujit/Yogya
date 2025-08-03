import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Session from "../models/Session.js";
export const createSession = async (req, res) => {
  const { title, tags, description,status } = req.body;


  if (!title || !description || !req.file) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
    let parsedTags = [];
    try {
    parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    if (!Array.isArray(parsedTags)) {
      throw new Error("Tags must be an array");
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid tags format. Must be a JSON string or array.",
    });
  }
  const validStatus = status === "Draft" ? "Draft" : "Publish";


  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    const fileUrl = result.secure_url;

    const session = await Session.create({
      title,
      description,
      tags:parsedTags,
      fileUrl,
      creater: req.userId,
      status:validStatus,
    });

    res.json({
      success: true,
      message: "Session created Successfully",
      session,
    });
  } catch (error) {


    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .sort({ createdAt: -1 })
      .populate("creater", "name email")
      .populate("likes", "name email");

    const formattedSessions = sessions.map((session) => ({
      _id: session._id,
      title: session.title,
      description: session.description,
      tags: session.tags,
      fileUrl: session.fileUrl,
      creater: session.creater,
      likes: session.likes,
      likesCount: session.likes.length,
      createdAt: session.createdAt,
      status:session.status,
      updatedAt:session.updatedAt,
    }));

    res.json({
      success: true,
      message: "Sessions fetched successfully",
      sessions: formattedSessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch sessions",
    });
  }
};

export const getSessionsById = async (req, res) => {
  try {
    const { sessionId } = req.params.id;

    const session = await Session.findById(sessionId)
      .populate("creater", "name email")
      .populate("likes", "name email");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      session: {
        _id: session._id,
        title: session.title,
        description: session.description,
        tags: session.tags,
        fileUrl: session.fileUrl,
        creater: session.creater,
        likes: session.likes,
        likesCount: session.likes.length,
        createdAt: session.createdAt,
        status:session.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch session",
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const hasLiked = session.likes.includes(userId);

    if (hasLiked) {
      session.likes.pull(userId);
    } else {
      session.likes.push(userId);
    }

    await session.save();
    res.json({
      success: true,
      message: hasLiked ? "Session unliked" : "Session liked",
      likesCount: session.likes.length,
      likedByUser: !hasLiked,
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle like",
    });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    const file = req.file
    const session = await Session.findById(id);

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.creater.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this session",
      });
    }
    if (title) {
      session.title = title;
    }
    if (description) {
      session.description = description;
    }

    if (tags) {
       try {
        session.tags = JSON.parse(tags);
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid tags format" });
      }
    }
     if (file) {

     const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

     session.fileUrl = result.secure_url;
    }
    session.status='Publish'
    await session.save();

    res.json({ success: true, message: "Session updated", session });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update session",
    });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.creater.toString() !== req.userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to delete this session",
        });
    }

    await session.deleteOne();
    res.json({ success: true, message: "Session deleted" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to delete session",
      });
  }
};

