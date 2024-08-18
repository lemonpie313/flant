import React, { useState } from 'react';
import './Assign.scss'; // 스타일 파일을 import
import { communityApi } from '@/services/api'; // communityApi를 import

const Assign = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [nickname, setNickname] = useState('');
  const [communityId, setCommunityId] = useState(1); // 예시로 communityId 1

  // 커뮤니티 가입 처리 함수
  const handleJoinCommunity = () => {
    communityApi.assign(communityId)
      .then((response) => {
        if (response.status === 200) {
          setIsJoined(true);
          alert(`커뮤니티 ${response.data.data.communityName}에 성공적으로 가입되었습니다.`);
        } else {
          alert('가입에 실패했습니다.');
        }
      })
      .catch((error) => {
        console.error('API 호출 오류:', error);
        alert('오류가 발생했습니다.');
      });
  };

  return (
    <div className="assign-container">
      <h1>커뮤니티 가입</h1>
      {!isJoined ? (
        <div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="nickname-input"
          />
          <button onClick={handleJoinCommunity} className="join-button">
            커뮤니티 가입
          </button>
        </div>
      ) : (
        <p>이미 커뮤니티에 가입하셨습니다!</p>
      )}
    </div>
  );
};

export default Assign;
