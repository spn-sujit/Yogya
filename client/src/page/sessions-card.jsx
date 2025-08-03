import React from 'react';
import { NavLink } from 'react-router-dom';

const Card = ({ id, title, tags, status, created_at, updated_at, user, description }) => {
  
  return (
    <div className="bg-[#fffaf3] rounded-xl shadow-md border border-[#f1e9dc] p-4 max-w-sm transition hover:scale-[1.02] duration-200">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#3f3a2d]">{title}</h3>

        <div className="flex flex-wrap gap-2 text-xs text-white">
          {tags?.map((tag, i) => (
            <span key={i} className="bg-[#9f8772] px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {description && (
          <p className="text-sm text-gray-700 line-clamp-2">
            {description}
          </p>
        )}

        <p className="text-xs text-gray-600">
          Status:{" "}
          <span className={`font-semibold ${status === 'published' ? 'text-green-600' : 'text-red-500'}`}>
            {status} by {user.name}
          </span>
        </p>

        <p className="text-[11px] text-gray-500">
          Created: {new Date(created_at).toLocaleDateString()}
        </p>
        <p className="text-[11px] text-gray-500">
          Updated: {new Date(updated_at).toLocaleDateString()}
        </p>

        <NavLink
          to={`/my-session/${id}`}
          className="inline-block w-full text-center bg-[#eab308] hover:bg-yellow-400 text-white font-medium py-2 rounded-full text-sm mt-2"
        >
          View Session
        </NavLink>
      </div>
    </div>
  );
};

export default Card;
