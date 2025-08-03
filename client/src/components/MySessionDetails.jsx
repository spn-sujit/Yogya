import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Heart } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const MySessionDetails = () => {
  const { id } = useParams();

  const { sessions, navigate, axios, userData } = useAppContext();

  const session = sessions.find((s) => s._id === id);

  if (!session) {
    return <p className="p-6 text-red-500">Sessions not found</p>;
  }

  const handleUpdate = () => {
    navigate(`/publish/${id}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this session?"
    );
    if (!confirmed) return;

    try {
      const { data } = await axios.delete(`/api/session/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/my-sessions");
      } else {
        toast.error("Failed to delete session");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the session.");
    }
  };

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(session?.likes?.length || 0);

  useEffect(() => {
    if (session && userData) {
      const isLiked = session.likes.some(
        (like) => like._id.toString() === userData._id
      );
      console.log(
        "useEffect - session.likes:",
        session.likes,
        "userData._id:",
        userData._id,
        "isLiked:",
        isLiked
      );
      setLiked(isLiked);
    }
  }, [session, userData]);

  const toggleLike = async () => {
    try {
      const { data } = await axios.post(
        `/api/session/${session._id}/like`,
        {},
        { headers: { token: localStorage.getItem("token") } }
      );

      if (data.success) {
        setLiked(data.likedByUser);
        setLikeCount(data.likesCount);
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("An error occurred while toggling like");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-6 py-8 bg-[#fffaf3] border border-[#f1e9dc] rounded-2xl shadow space-y-6">
      {/* Title */}
      <h2 className="text-3xl font-bold text-[#3f3a2d]">{session.title}</h2>

      {/* Tags */}
      <div className="flex flex-wrap gap-3">
        {session.tags.map((tag, i) => (
          <span
            key={i}
            className="bg-yellow-300 text-[#3f3a2d] px-3 py-1 text-sm rounded-full font-medium shadow"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">Description</h3>
        <p className="text-gray-800 leading-relaxed">{session.description}</p>
      </div>

      {/* Metadata */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Created on:</strong>{" "}
          {new Date(session.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Last updated:</strong>{" "}
          {new Date(session.updatedAt).toLocaleDateString()}
        </p>
        <p>
          <strong>By:</strong> {session.creater.name}
        </p>
      </div>
      {/* View File Button */}
      <div className="pt-4">
        <a
          href={session.fileUrl || session.json_file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-full transition text-sm font-medium"
        >
          View File
        </a>
      </div>

      {userData && session.creater._id === userData._id && (
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition"
          >
            Delete
          </button>
        </div>
      )}

      {/* Like section at bottom */}
      <div className="flex items-center gap-2 pt-4">
        <button
          onClick={toggleLike}
          className={`hover:scale-110 transition-transform ${
            liked ? "text-red-500" : "text-gray-400"
          }`}
        >
          <Heart
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-6 h-6"
          />
        </button>
        <span className="text-sm text-gray-700">
          {likeCount} like{likeCount !== 1 && "s"}
        </span>
      </div>
    </div>
  );
};

export default MySessionDetails;
