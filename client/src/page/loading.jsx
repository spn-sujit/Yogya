import React from "react";
import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-50">
      <div className="flex flex-col items-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-amber-600" />
        <p className="text-amber-700 mt-3 font-semibold text-lg lowercase">
          loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;
