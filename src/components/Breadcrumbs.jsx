import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ crumbs }) => {
  return (
    <nav className="container mx-auto px-4 py-2">
      <ol className="list-reset flex text-gray-700">
        {crumbs.map((crumb, index) => (
          <li key={index}>
            {index !== 0 && <span className="mx-2">/</span>}
            {crumb.path ? (
              <Link to={crumb.path} className="text-edge-light-green hover:text-edge-green">
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;