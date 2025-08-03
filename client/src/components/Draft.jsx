
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {useDropzone} from 'react-dropzone'
import {toast} from 'react-hot-toast'
import { Link } from "react-router-dom";
const sessionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  tags: z.string().min(1, "Enter at least one tag"),
  description: z.string().min(5, "Description is required"),
});

  
  

const Draft= () => {
  const {
    register,
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
  const [uploadFile, setUploadedFile] = useState(null);
  const [filePreview,setFilePreview]=useState(null);
    const onDrop = (acceptedFile) => {
   const file = acceptedFile[0];
    if (!file) {toast.error('upload file first');return};
   if(file){
      if (file.type !== "application/json") {
      toast.error("Please upload a valid JSON file");
      return;
    }
    if(file.size >5*1024 *1024){
        toast.error("File size must be less than 5MB");
        return;
    }
    setUploadedFile(file);
   setFilePreview(URL.createObjectURL(file));
   }

  }
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,
         accept: {
          "application/json":[".json"],
      },
      maxFiles:1,
      multiple:false,
    });

    const onSubmit=(data)=>{
       if(!uploadFile){
        toast.error('Add file');
       }

       const tagsArray = data.tags.split(',').map(tag=>tag.trim());
    

     
    }
 



  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-[#fffaf3] shadow-md rounded-lg border border-[#f1e9dc]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold text-[#3f3a2d]">Publish a Session</h2>

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
       {...getRootProps()} className="p-4 border-2 border-dashed rounded-md border-gray-300 text-center cursor-pointer bg-white">
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag & drop a JSON file here, or click to select one</p>
      }
    </div>
    {uploadFile && (
        <p className="text-sm mt-2 text-gray-700">Selected File :{uploadFile.name}</p>

    )}
    <div className="mb-4">
        {filePreview &&
      <Link to={filePreview} target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-blue-600 underline ">
       View file
      </Link>
    }
    </div>
    
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#eab308] hover:bg-yellow-400 text-white font-medium py-2 rounded-full transition-colors duration-200"
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default Draft;
