export const MESSAGES = {
  AUTH: {
    COMMON: {
      OAUTH: {
        DUPLICATED: '이미 가입된 계정입니다. 다른 방법으로 로그인해주세요.',
      },
      OAUTH_GOOGLE: {
        NOT_FOUND: '해당 google 계정이 존재하지 않습니다.',
        PASSWORD: {
          REQUIRED:
            '구글 소셜을 통해 회원가입한 사용자는 비밀번호를 설정해주세요',
        },
      },
      EMAIL: {
        REQUIRED: '이메일을 입력해 주세요.',
        INVALID_FORMAT: '이메일 형식이 올바르지 않습니다.',
      },
      NAME: {
        REQUIRED: '이름을 입력해 주세요.',
      },
      PROFILE: {
        REQUIRED: '프로필 이미지를 등록해 주세요.',
      },
      PASSWORD: {
        REQUIRED: '비밀번호을 입력해 주세요.',
        INVALID_FORMAT:
          '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함한 8자리 이상이여야 합니다.',
        PASSWORD_MISMATCH: '기존 비밀번호와 일치하지 않습니다.',
      },
      PASSWORD_CONFIRM: {
        REQUIRED: '비밀번호 확인을 입력해 주세요.',
        NOT_MATCHED_WITH_PASSWORD: '입력 한 두 비밀번호가 일치하지 않습니다.',
        NEW_PASSWORD_MISMATCH:
          '새 비밀번호와 새 비밀번호 확인이 서로 일치하지 않습니다.',
      },
      JWT: {
        UNAUTHORIZED: '인증 정보가 유효하지 않습니다.',
      },
      COMMUNITY_USER: {
        NO_USER: '멤버 식별에 필요한 사용자 정보를 입력해주세요.',
        NO_COMMUNITY: '멤버 식별에 필요한 커뮤니티 정보를 입력해주세요.',
        NOT_ARTIST: '해당 커뮤니티의 아티스트가 아닙니다.',
        NOT_MANAGER: '해당 커뮤니티의 매니저가 아닙니다.',
      },
      DUPLICATED: '이미 등록된 사용자 입니다.',
      FORBIDDEN: '접근 권한이 없습니다.',
    },
    SIGN_UP: {
      SECCEED: '회원가입에 성공했습니다.',
    },
    SIGN_IN: {
      SECCEED: '로그인에 성공했습니다.',
    },
  },
  COMMUNITY: {
    COMMON: {
      NOT_FOUND: '해당하는 커뮤니티를 찾을 수 없습니다.',
      COMMUNITYID: {
        REQUIRED: '해당하는 커뮤니티 ID를 입력해주세요.',
      },
    },
  },
  COMMUNITY_USER: {
    COMMON: {
      NOT_FOUND: '커뮤니티에 가입하지 않은 사용자입니다.',
    },
  },
  USER: {
    COMMON: {
      NOT_FOUND: '해당하는 유저를 찾을 수 없습니다.',
      USERID: {
        REQUIRED: '해당하는 유저 ID를 입력해주세요.',
      },
      PROFILE_IMAGE: {
        REQUIRED: '프로필 이미지를 입력해주세요.',
      },
    },
    PASSWORD_CHECK: {
      SUCCEED: '비밀번호 확인에 성공했습니다.',
    },
    READ_ME: {
      SUCCEED: '내 정보 조회에 성공했습니다.',
    },
    UPDATE_ME: {
      SUCCEED: '내 정보 수정에 성공했습니다.',
      NO_BODY_DATA: '수정할 데이터를 입력해주세요',
      DUPLICATED_EMAIL: '현재와 동일한 이메일입니다.',
    },
    DELETE: {
      SUCCEED: '회원 탈퇴에 성공했습니다.',
    },
    UPLOAD_PROFILE: {
      SUCCEED: '프로필 이미지 업로드에 성공했습니다.',
    },
  },
  ARTIST: {
    COMMON: {
      DUPLICATED: '이미 등록된 아티스트 입니다.',
      NOT_FOUND: '해당하는 아티스트를 찾을 수 없습니다.',
      NICKNAME: {
        REQUIRED: '아티스트 닉네임을 입력해주세요',
      },
    },
    CREATE: '아티스트 생성에 성공했습니다.',
    DELETE: '아티스트 삭제에 성공했습니다.',
  },
  MANAGER: {
    COMMON: {
      DUPLICATED: '이미 커뮤니티에 등록된 매니저 입니다.',
      NOT_FOUND: '해당하는 매니저를 찾을 수 없습니다.',
      NICKNAME: {
        REQUIRED: '매니저 닉네임을 입력해주세요',
      },
    },
    CREATE: '매니저 생성에 성공했습니다',
    DELETE: '매니저 삭제에 성공했습니다.',
  },
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
  CUSTOM_DECORATOR: {
    IS_NOT_EMPTY: '값을 입력해주세요.',
  },
};
