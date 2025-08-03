import React, { useEffect, useState } from 'react';
import Card from '../page/sessions-card';
import { useAppContext } from '../context/AppContext';

const MySessions = () => {
  const { userData, sessions,navigate } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 6;

  useEffect(() => {
    console.log('User:', userData);
    console.log('Sessions:', sessions);
  }, [userData, sessions]);

  if (!userData) {
      navigate('/login');
    return <p className="text-center mt-10 text-yellow-600">Log in to view your Sessions</p>;
  }
   
  const mySessions = sessions.filter(
    (session) =>
      session.status === 'Publish' &&
      session.creater?._id === userData._id
  );

  const totalPages = Math.ceil(mySessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const currentSessions = mySessions.slice(startIndex, startIndex + sessionsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? 'bg-yellow-400 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  if (mySessions.length === 0) {
    return <p className="text-center mt-10 text-gray-600">No published sessions found.</p>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentSessions.map((session) => (
          <Card
            key={session._id}
            id={session._id}
            title={session.title}
            tags={session.tags}
            status={session.status}
            json_file_url={session.fileUrl}
            created_at={session.createdAt}
            updated_at={session.updatedAt}
            user={session.creater}
            description={session.description?.slice(0, 15) + '...'}
          />
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2 text-sm">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {renderPaginationButtons()}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MySessions;
