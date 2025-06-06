import React from 'react';
import classNames from 'classnames';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div
      className={classNames(
        'bg-gray-900 border border-gray-800 rounded-xl p-6',
        {
          'hover:border-red-600 transition-colors duration-200': hover,
        },
        className
      )}
    >
      {children}
    </div>
  );
};