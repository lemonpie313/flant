import React from 'react';

interface Community {
  communityId: number;
  communityName: string;
}

interface RoomSelectorProps {
  communities: Community[];
  onSelectRoom: (communityId: number) => void;
  onCreateRoom: (communityName: string) => void; // 방 생성 함수 추가
  isManager: boolean; // 매니저 권한 확인
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ communities, onSelectRoom, onCreateRoom, isManager }) => {
  const [newRoomName, setNewRoomName] = React.useState('');

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName);
      setNewRoomName('');
    }
  };

  return (
    <div className="room-selector">
      <h4>채팅방 선택</h4>
      <ul>
        {communities.map((community) => (
          <li key={community.communityId}>
            <button onClick={() => onSelectRoom(community.communityId)}>
              {community.communityName}
            </button>
          </li>
        ))}
      </ul>
      {isManager && ( // 매니저일 경우에만 방 생성 UI 표시
        <div>
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="새로운 방 이름"
          />
          <button onClick={handleCreateRoom}>방 생성</button>
        </div>
      )}
    </div>
  );
};

export default RoomSelector;
