export const MESSAGES = {
  LIKE: {
    ITEMID: {
      REQUIRED: '좋아요 할 대상 아이템 ID를 입력해주세요.',
      NOT_FOUND: '대상 아이템이 존재하지 않습니다.',
    },
    STATUS: {
      REQUIRED: '좋아요 상태를 입력해주세요.',
      INVALID_FORMAT: '유효하지 않은 상태입니다.',
    },
    ITEMTYPE: {
      REQUIRED: '대상 아이템 타입을 입력해주세요.',
      INVALID_FORMAT: '유효하지 않은 아이템 타입입니다.',
    },
    USERID: {
      REQUIRED: '사용자 ID를 입력해주세요.',
    },
    UPDATE_STATUS: {
      SECCEED: '좋아요 상태 수정에 성공했습니다.',
    },
  },
  COMMUNITY: {
    CREATE: {
      SUCCEED: '커뮤니티 생성에 성공했습니다.',
    },
    ASSIGN: {
      SUCCEED: '커뮤니티 가입에 성공했습니다.',
    },
    FIND: {
      SUCCEED: '모든 커뮤니티 조회에 성공했습니다.',
    },
    FINDMY: {
      SUCCEED: '내 커뮤니티 조회에 성공했습니다.',
    },
    FINDONE: {
      SUCCEED: '커뮤니티 상세 조회에 성공했습니다.',
    },
    UPDATE: {
      REQUIRED: '입력된 수정 사항이 없습니다.',
      UNAUTHORIZED: '커뮤니티 수정 권한이 없습니다',
      SUCCEED: '커뮤니티 수정에 성공했습니다.'
    },
    REMOVE: {
      UNAUTHORIZED: '커뮤니티 삭제 권한이 없습니다',
      SUCCEED: '커뮤니티 삭제에 성공했습니다.',
    },
    UPDATELOGO: {
      UNAUTHORIZED: '커뮤니티 수정 권한이 없습니다',
      BAD_REQUEST:'등록할 이미지를 업로드 해주세요.',
      SUCCEED: '로고 이미지 수정이 완료되었습니다.',
    },
    UPDATECOVER: {
      UNAUTHORIZED: '커뮤니티 수정 권한이 없습니다',
      BAD_REQUEST:'등록할 이미지를 업로드 해주세요.',
      SUCCEED: '커버 이미지 수정이 완료되었습니다.',
    },
  }
};
