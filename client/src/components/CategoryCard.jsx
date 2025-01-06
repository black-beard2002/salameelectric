import React from 'react';

const CategoryCard = ({ category, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="relative w-1/4 aspect-square bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-zinc-700"
    >
      <div className="p-2 h-full min-h-fit flex flex-col items-center justify-center space-y-2">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-gray-400"
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <p className="text-[1rem] text-center py-1 truncate w-full text-zinc-800 dark:text-zinc-100">
          {category.name}
        </p>
      </div>
    </div>
  );
};

export default CategoryCard;