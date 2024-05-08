import React, { useState } from 'react';
// import ReactDOM from 'react-dom';
import './popup.css';
import { createRoot } from 'react-dom/client';

const savedPosts = [
  'Riskified - Full Stack Engineer',
  'Riskified - Full Stack Engineer',
  'Riskified - Full Stack Engineer',
  'Riskified - Full Stack Engineer',
];

const App: React.FC<{}> = () => {
  const [companySeachName, setCompanySeachName] = useState(null);
  console.log('companySeachName: ', companySeachName); //removeEytan
  function handleSearchCompany(e: React.FormEvent) {
    e.preventDefault();
    //TODO: popup company search
  }
  return (
    <>
      <div className="popup-main-container">
        {' '}
        <form onSubmit={handleSearchCompany} className="popup-form">
          <input
            onChange={(e) => setCompanySeachName(e.target.value)}
            type="text"
            placeholder="Search Company"
            className="popup-list-row-container popup-search-company-input"
          />
        </form>
        <div className="popup-list-container">
          {savedPosts.map((post, index) => (
            <div key={index} className="popup-list-row-container">
              {post}
            </div>
          ))}
        </div>
        <button>Go to dashboard</button>
      </div>
    </>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container!);
root.render(<App />);
