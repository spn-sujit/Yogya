import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

const sessionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  tags: z.string().min(1, "Enter at least one tag"),
  description: z.string().min(5, "Description is required"),
});

const Publish = () => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: "",
      tags: "",
      description: "",
    },
  });
  const { id } = useParams();
  const { sessions ,userData} = useAppContext();
  const isEditing = !!id;
   const [isFormInitialized, setIsFormInitialized] = useState(false);
  useEffect(() => {
    if (id && sessions.length > 0 && !isFormInitialized) {
      const sessionToEdit = sessions.find((s) => s._id === id);
      if (sessionToEdit) {
        reset({
          title: sessionToEdit.title,
          tags: sessionToEdit.tags.join(", "),
          description: sessionToEdit.description,
        });
        if (sessionToEdit.fileUrl) {
    setFilePreview(sessionToEdit.fileUrl);
  }
  setIsFormInitialized(true);
      }
    }
  }, [id,reset,sessions,isEditing,isFormInitialized]);
  const [uploadFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [statusLabel, setStatusLabel] = useState("Publish");
  const [isLoading, setIsLoading] = useState(false);


  const { axios, userToken, navigate, fetchMySessions } = useAppContext();
  const onDrop = (acceptedFile) => {
    const file = acceptedFile[0];
    if (!file) {
      toast.error("upload file first");
      return;
    }
    if (file) {
      if (file.type !== "application/json") {
        toast.error("Please upload a valid JSON file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setUploadedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };
    if (!userData) {
      navigate('/login');
    return <p className="text-center mt-10 text-yellow-600">Log in to view your Sessions</p>;
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const onSubmit = async (data, forcedStatus = "Publish") => {
    if (!uploadFile && !isEditing) {
      toast.error("Add file");
      return;
    }

    const validStatus = forcedStatus === "Draft" ? "Draft" : "Publish";
    console.log("validStatus:", validStatus);
    try {
      setIsLoading(true);
      const loadingLabel =
        forcedStatus === "Draft"
          ? "Saving Draft..."
          : isEditing
          ? "Updating..."
          : "Publishing...";
      setStatusLabel(loadingLabel);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append(
        "tags",
        JSON.stringify(data.tags.split(",").map((tag) => tag.trim()))
      );
      formData.append("description", data.description);
      formData.append("file", uploadFile);
      formData.append("status", validStatus);

      const url = isEditing ? `/api/session/${id}` : "/api/session/create";
      const method = isEditing ? "put" : "post";

      const response = await axios[method](url, formData, {
        headers: { token: userToken, "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchMySessions?.();
        navigate("/my-sessions");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to publish session");
    } finally {
      setIsLoading(false);
      setStatusLabel("Publish");
    }
  };

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      const formData = getValues();

      if (
        formData.title ||
        formData.tags ||
        formData.description ||
        uploadFile
      ) {
        event.preventDefault();
        event.returnValue = "";
        try {
          await onSubmit(formData, "Draft");
        } catch (error) {
          console.log("Error saving draft before unload:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [getValues, uploadFile]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-[#fffaf3] shadow-md rounded-lg border border-[#f1e9dc]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold text-[#3f3a2d]">
          Publish a Session
        </h2>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm text-[#6c5f46] mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            placeholder="e.g., Gentle Morning Stretch"
            className={`w-full p-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-md outline-none focus:ring-2 focus:ring-yellow-400`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm text-[#6c5f46] mb-1">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            {...register("tags")}
            placeholder="e.g., yoga, beginner, morning"
            className={`w-full p-2 border ${
              errors.tags ? "border-red-500" : "border-gray-300"
            } rounded-md outline-none focus:ring-2 focus:ring-yellow-400`}
          />
          {errors.tags && (
            <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm text-[#6c5f46] mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            placeholder="Describe what this session offers..."
            className={`w-full p-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md outline-none focus:ring-2 focus:ring-yellow-400`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div
          {...getRootProps()}
          className="p-4 border-2 border-dashed rounded-md border-gray-300 text-center cursor-pointer bg-white"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop a JSON file here, or click to select one</p>
          )}
        </div>
        {uploadFile && (
          <p className="text-sm mt-2 text-gray-700">
            Selected File :{uploadFile.name}
          </p>
        )}
        <div className="mb-4">
          {filePreview && (
            <Link
              to={filePreview}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline "
            >
              View file
            </Link>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center items-center gap-2 
    ${
      isLoading
        ? "bg-yellow-300 cursor-not-allowed"
        : "bg-[#eab308] hover:bg-yellow-400"
    } 
    text-white font-medium py-2 rounded-full transition-colors duration-200`}
        >
          {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
          {isLoading ? statusLabel : isEditing ? "Update" : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default Publish;
