import React from 'react';

interface TextBlockProps {
  children: React.ReactNode;
}

const TextBlock = ({children}: TextBlockProps) => {
  return (
    <div className="w-full h-[600px] m-0 relative flex justify-center items-center">
      <h1 className="z-10 text-6xl text-black font-bold">{children}</h1>
      <div className="-z-10 bg-gradient-to-br from-blue-200 blur-3xl to-green-200 w-[900px] h-[900px] rounded-full absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
};

export default TextBlock;
