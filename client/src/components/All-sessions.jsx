import React, { useState } from 'react';
import Card from '../page/sessions-card';
import { useAppContext } from '../context/AppContext';
import { useEffect } from 'react';

const Sessions = () => {

    const {sessions,loadingSessions}=useAppContext();
  


    const [currentPage,setCurrentPage]=useState(1);

    const sessionsPerPage = 6;

    const publishedSessions= sessions.filter(session =>session.status === 'Publish');
    const totalPages = Math.ceil(publishedSessions.length/sessionsPerPage);


    const startIndex = (currentPage-1) * sessionsPerPage;
    const currentSessions = publishedSessions.slice(startIndex,startIndex+sessionsPerPage);

    const goToPage=(page)=>{
        if(page>=1 && page<=totalPages){
            setCurrentPage(page);
        }
    };

    const renderPaginationButtons  = ()=>{
        const buttons=[];
        for(let i =1;i<=totalPages;i++){
            buttons.push(
                <button key={i}
                    onClick={()=>goToPage(i)}
                     className={`px-3 py-1 rounded ${
          currentPage === i
            ? 'bg-yellow-400 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}>
                    {i}
                </button>
            );
            
        }
        return buttons;
    }

      if (loadingSessions) {
    return <p className="text-center mt-10 text-yellow-600 font-semibold">Loading sessions...</p>;
  }
   if (publishedSessions.length === 0) {
    return <p className="text-center mt-10 text-gray-600">No published sessions available.</p>;
  }
  return (
 <div className='p-6'>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
      {currentSessions.map((session) => (
        <Card
          key={session._id}
          id={session._id}
          title={session.title}
          tags={session.tags}
          status={session.status}
          json_file_url={session.json_file_url}
          created_at={session.createdAt}
          updated_at={session.updatedAt}
          user={session.creater}
         description={(session.description?.slice(0,15)||" ")+'...'}

        />
      ))}
    </div>
    <div className="flex justify-center mt-6 space-x-2 text-sm">
        <button  onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50">
            Prev
        </button>
       
        {renderPaginationButtons()}
        <button onClick={() => goToPage(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50">
                  Next
        </button>
    </div>
 </div>
  );
};

export default Sessions;
