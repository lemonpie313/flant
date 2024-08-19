import React from 'react';
import { NavLink } from 'react-router-dom';
import "../../styles/CommunityNavigationHeader.scss"


const CommunityNavigationHeader: React.FC = () => {
  return (
    <nav className="nav-bar">
      <NavLink to="#" className="nav-link">
        <span className="nav-tab">Feed</span>
      </NavLink>
      <NavLink to="/artists" className="nav-link">
        <span className="nav-tab">Artist</span>
      </NavLink>
      <NavLink to="#" className="nav-link">
        <span className="nav-tab">Media</span>
      </NavLink>
      <NavLink to="#" className="nav-link">
        <span className="nav-tab">LIVE</span>
      </NavLink>
      <div className="shop-link-wrapper">
        <NavLink to="/merchandise" className="nav-link shop-link">
          Shop
        </NavLink>
      </div>
    </nav>
  );
};

export default CommunityNavigationHeader;
