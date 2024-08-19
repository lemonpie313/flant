import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import "../../styles/CommunityNavigationHeader.scss";

const CommunityNavigationHeader: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();

  return (
    <nav className="nav-bar">
      <NavLink to={`/communities/${communityId}/feed`} className="nav-link">
        <span className="nav-tab">Feed</span>
      </NavLink>
      <NavLink to={`/communities/${communityId}/artists`} className="nav-link">
        <span className="nav-tab">Artist</span>
      </NavLink>
      <NavLink to={`/communities/${communityId}/media`} className="nav-link">
        <span className="nav-tab">Media</span>
      </NavLink>
      {/* <NavLink to={`/communities/${communityId}/live`} className="nav-link">
        <span className="nav-tab">LIVE</span>
      </NavLink> */}
      <div className="shop-link-wrapper">
        <NavLink to={`/communities/${communityId}/merchandise`} className="nav-link shop-link">
          Shop
        </NavLink>
      </div>
    </nav>
  );
};

export default CommunityNavigationHeader;
