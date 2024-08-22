# 🖥️ Team 오물조물 NodeJs 최종 프로젝트

![TGSrd-removebg-preview](https://github.com/user-attachments/assets/a69e6e9a-2d34-4fca-b52f-e44a5a037626)

## 목차 
- 프로젝트 소개 
- 팀원 구성
- 개발 기간
- 개발 환경
- API 명세서 및 ERD 
- 파일 구조
- 역할 분담
- 주요 기능 및 설명
- 트러블 슈팅
- 소감

---
## 프로젝트 소개
- 프로젝트 이름 : 최종 프로젝트  Flant 
- 내용 : NestJs를 이용한 최종프로젝트
- 구분 : 팀 프로젝트
- GitHub : https://github.com/lemonpie313/sparta_final_project
- 시연 영상 : 
- 배포 : https://flat.club
--- 
## 팀원 구성
- 리더 : 서동현 [@lucetaseo](https://github.com/lucetaseo)
- 부리더 : 진수현 [@lemonpie313](https://github.com/lemonpie313)
- 팀원 : 김호연 [blueclorox](https://github.com/blueclorox)
- 팀원 : 황소은 [SooooMm](https://github.com/SooooMm)
- 팀원 : 이성운 [@SW-64](https://github.com/SW-64)
- 팀원 : 이민준 [minjun0702](https://github.com/minjun0702)
- 튜터 : 정영훈

##  개발 기간
2024.07.11 ~ 2024.07.17
--- 
##  개발 환경
- 운영체제 : Window/Mac
- BackEnd : TypeScript, NestJs, MySQL(TypeORM)
- Tool : Visual Studio Code, Insomnia, DBeaver, Swagger
- Publish :
---

## API 명세서 및 ERD 와이어 프레임
- API 명세서
- 추후 이미지 삽입 예정


- ERD 
![image](https://github.com/user-attachments/assets/5420d622-974c-417f-8769-82eb9d8d0671)



### 폴더 구조
```
📦 
├─ .github
│  ├─ ISSUE_TEMPLATE
│  │  ├─ bugfix.md
│  │  ├─ feature.md
│  │  └─ update.md
│  ├─ PULL_REQUEST_TEMPLATE.md
│  └─ workflows
│     ├─ cd.yml
│     └─ ci.yml
├─ .vscode
│  └─ settings.json
├─ final_project_backend
│  ├─ .env.example
│  ├─ .eslintrc.js
│  ├─ .gitignore
│  ├─ .prettierrc
│  ├─ dev
│  ├─ nest-cli.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ toss.html
│  ├─ report.json
│  ├─ src
│  │  ├─ admin
│  │  │  ├─ admin.module.ts
│  │  │  ├─ controllers
│  │  │  │  ├─ admin-artist.controller.ts
│  │  │  │  └─ admin-manager.controller.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-artist.dto.ts
│  │  │  │  └─ create-manager.dto.ts
│  │  │  ├─ entities
│  │  │  │  ├─ artist.entity.ts
│  │  │  │  └─ manager.entity.ts
│  │  │  └─ services
│  │  │     ├─ admin-artist.service.ts
│  │  │     └─ admin-manager.service.ts
│  │  ├─ all-exceptions.filter.ts
│  │  ├─ app.controller.spec.ts
│  │  ├─ app.controller.ts
│  │  ├─ app.module.ts
│  │  ├─ app.service.ts
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ decorators
│  │  │  │  ├─ community-user-roles.decorator.ts
│  │  │  │  └─ roles.decorator.ts
│  │  │  ├─ dto
│  │  │  │  ├─ sign-in.dto.ts
│  │  │  │  └─ sign-up.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ refresh-token.entity.ts
│  │  │  ├─ guards
│  │  │  │  ├─ comment-creation.guard.ts
│  │  │  │  ├─ community-user.guard.ts
│  │  │  │  ├─ google-auth.guard.ts
│  │  │  │  ├─ jwt-auth.guard.ts
│  │  │  │  ├─ local-auth.guard.ts
│  │  │  │  ├─ manager.guard.ts
│  │  │  │  ├─ optionaljwtauthguard .ts
│  │  │  │  └─ roles.guard.ts
│  │  │  ├─ interfaces
│  │  │  │  └─ jwt-payload.interface.ts
│  │  │  └─ strategies
│  │  │     ├─ google.strategy.ts
│  │  │     ├─ jwt-refresh-token.strategy.ts
│  │  │     ├─ jwt.strategy.ts
│  │  │     └─ local.strategy.ts
│  │  ├─ cart
│  │  │  ├─ cart.controller.ts
│  │  │  ├─ cart.module.ts
│  │  │  ├─ cart.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-cart.dto.ts
│  │  │  │  └─ update-cart.dto.ts
│  │  │  ├─ entities
│  │  │  │  ├─ cart.entity.ts
│  │  │  │  └─ cart.item.entity.ts
│  │  │  └─ types
│  │  │     └─ update-quantity.type.ts
│  │  ├─ chat
│  │  │  ├─ chat.gateway.ts
│  │  │  ├─ chat.module.ts
│  │  │  └─ chat.service.ts
│  │  ├─ comment
│  │  │  ├─ comment.controller.ts
│  │  │  ├─ comment.module.ts
│  │  │  ├─ comment.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-comment.dto.ts
│  │  │  │  ├─ create-reply.dto.ts
│  │  │  │  └─ update-comment.dto.ts
│  │  │  └─ entities
│  │  │     └─ comment.entity.ts
│  │  ├─ community
│  │  │  ├─ community-user
│  │  │  │  ├─ community-user.module.ts
│  │  │  │  ├─ community-user.service.ts
│  │  │  │  ├─ entities
│  │  │  │  │  └─ communityUser.entity.ts
│  │  │  │  └─ types
│  │  │  │     └─ community-user-role.type.ts
│  │  │  ├─ community.controller.ts
│  │  │  ├─ community.module.ts
│  │  │  ├─ community.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ community-assign.dto.ts
│  │  │  │  ├─ create-community.dto.ts
│  │  │  │  ├─ find-community-user.dto.ts
│  │  │  │  └─ update-community.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ community.entity.ts
│  │  │  └─ types
│  │  │     └─ posts.type.ts
│  │  ├─ configs
│  │  │  ├─ database.config.ts
│  │  │  ├─ env-validation.config.ts
│  │  │  └─ google-env-validation.config.ts
│  │  ├─ constants
│  │  │  └─ message.constant.ts
│  │  ├─ data-source.ts
│  │  ├─ database
│  │  │  ├─ factories
│  │  │  │  ├─ artist.factory.ts
│  │  │  │  ├─ community-user.factory.ts
│  │  │  │  ├─ membership.factory.ts
│  │  │  │  └─ user.factory.ts
│  │  │  └─ seeds
│  │  │     ├─ admin.seeder.ts
│  │  │     ├─ artist.seeder.ts
│  │  │     ├─ community-user.seeder.ts
│  │  │     ├─ community.seeder.ts
│  │  │     ├─ manager.seeder.ts
│  │  │     ├─ membership.seeder.ts
│  │  │     └─ user.seeder.ts
│  │  ├─ factory
│  │  │  ├─ community-image-upload.factory.ts
│  │  │  ├─ media-file-upload.factory.ts
│  │  │  ├─ notice-image-upload.factory.ts
│  │  │  └─ post-image-upload.factory.ts
│  │  ├─ filters
│  │  │  └─ validation.exception.ts
│  │  ├─ form
│  │  │  ├─ dto
│  │  │  │  ├─ create-form.dto.ts
│  │  │  │  └─ update-form.dto.ts
│  │  │  ├─ entities
│  │  │  │  ├─ apply-user.entity.ts
│  │  │  │  ├─ form-question.entity.ts
│  │  │  │  └─ form.entity.ts
│  │  │  ├─ form.controller.ts
│  │  │  ├─ form.module.ts
│  │  │  ├─ form.service.ts
│  │  │  └─ types
│  │  │     ├─ form-apply-type.enum.ts
│  │  │     └─ form-type.enum.ts
│  │  ├─ like
│  │  │  ├─ dto
│  │  │  │  └─ create-like.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ like.entity.ts
│  │  │  ├─ like.module.ts
│  │  │  ├─ like.service.ts
│  │  │  └─ types
│  │  │     ├─ itemType.types.ts
│  │  │     └─ likeStatus.types.ts
│  │  ├─ live
│  │  │  ├─ dtos
│  │  │  │  └─ create-live.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ live.entity.ts
│  │  │  ├─ live.controller.ts
│  │  │  ├─ live.module.ts
│  │  │  └─ live.service.ts
│  │  ├─ main.ts
│  │  ├─ media
│  │  │  ├─ dto
│  │  │  │  ├─ create-media.dto.ts
│  │  │  │  └─ update-media.dto.ts
│  │  │  ├─ entities
│  │  │  │  ├─ media-file.entity.ts
│  │  │  │  └─ media.entity.ts
│  │  │  ├─ media.controller.ts
│  │  │  ├─ media.module.ts
│  │  │  └─ media.service.ts
│  │  ├─ membership
│  │  │  ├─ dtos
│  │  │  │  └─ membership.dto.ts
│  │  │  ├─ entities
│  │  │  │  ├─ membership-payment.entity.ts
│  │  │  │  └─ membership.entity.ts
│  │  │  ├─ membership.controller.ts
│  │  │  ├─ membership.module.ts
│  │  │  ├─ membership.service.ts
│  │  │  └─ types
│  │  │     └─ membership-payment-type.enum.ts
│  │  ├─ merchandise
│  │  │  ├─ dto
│  │  │  │  ├─ create-category.dto.ts
│  │  │  │  ├─ create-merchandise-post.dto.ts
│  │  │  │  ├─ find-merchandise.dto.ts
│  │  │  │  └─ update-merchandise.dto.ts
│  │  │  ├─ entities
│  │  │  │  ├─ marchandise-option.entity.ts
│  │  │  │  ├─ merchandise-category.entity.ts
│  │  │  │  ├─ merchandise-image.entity.ts
│  │  │  │  └─ merchandise.entity.ts
│  │  │  ├─ merchandise.controller.ts
│  │  │  ├─ merchandise.module.ts
│  │  │  └─ merchandise.service.ts
│  │  ├─ notice
│  │  │  ├─ dto
│  │  │  │  ├─ create-notice.dto.ts
│  │  │  │  └─ update-notice.dto.ts
│  │  │  ├─ entities
│  │  │  │  ├─ notice-image.entity.ts
│  │  │  │  └─ notice.entity.ts
│  │  │  ├─ notice.controller.ts
│  │  │  ├─ notice.module.ts
│  │  │  └─ notice.service.ts
│  │  ├─ notification
│  │  │  ├─ dto
│  │  │  │  ├─ create-notification.dto.ts
│  │  │  │  └─ update-notification.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ notification.entity.ts
│  │  │  ├─ notification.controller.ts
│  │  │  ├─ notification.module.ts
│  │  │  └─ notification.service.ts
│  │  ├─ order
│  │  │  ├─ dto
│  │  │  │  ├─ create-order.dto.ts
│  │  │  │  └─ update-order.dto.ts
│  │  │  ├─ entities
│  │  │  │  ├─ order.entity.ts
│  │  │  │  └─ orderItem.entity.ts
│  │  │  ├─ order.controller.ts
│  │  │  ├─ order.module.ts
│  │  │  ├─ order.service.ts
│  │  │  └─ types
│  │  │     └─ progress.types.ts
│  │  ├─ post
│  │  │  ├─ dto
│  │  │  │  ├─ create-post.dto.ts
│  │  │  │  └─ update-post.dto.ts
│  │  │  ├─ entities
│  │  │  │  ├─ post-image.entity.ts
│  │  │  │  └─ post.entity.ts
│  │  │  ├─ post.controller.ts
│  │  │  ├─ post.module.ts
│  │  │  └─ post.service.ts
│  │  ├─ user
│  │  │  ├─ dto
│  │  │  │  ├─ check-password-dto.ts
│  │  │  │  ├─ delete-user.dto.ts
│  │  │  │  ├─ search-user.dto.ts
│  │  │  │  └─ update-user.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ user.entity.ts
│  │  │  ├─ interfaces
│  │  │  │  └─ partial-user.entity.ts
│  │  │  ├─ types
│  │  │  │  ├─ user-provider.type.ts
│  │  │  │  └─ user-role.type.ts
│  │  │  ├─ user.controller.ts
│  │  │  ├─ user.module.ts
│  │  │  └─ user.service.ts
│  │  ├─ util
│  │  │  ├─ api-response.interface.ts
│  │  │  ├─ decorators
│  │  │  │  ├─ api-file.decorator.ts
│  │  │  │  ├─ is-not-emtpy-constraint.decorator.ts
│  │  │  │  ├─ is-valid-name-constraint.ts
│  │  │  │  └─ user-info.decorator.ts
│  │  │  ├─ image-upload
│  │  │  │  └─ create-s3-storage.ts
│  │  │  ├─ is-empty-util.ts
│  │  │  └─ response-util.ts
│  │  └─ webhook.interceptor.ts
│  ├─ test
│  │  ├─ app.e2e-spec.ts
│  │  ├─ jest-e2e.json
│  │  ├─ live.scenario.yml
│  │  ├─ posts.scenario.yml
│  │  └─ users.csv
│  ├─ tsconfig.build.json
│  └─ tsconfig.json
├─ final_project_frontend
│  ├─ .env.example
│  ├─ .gitignore
│  ├─ README.md
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ default-profile.png
│  │  ├─ favicon.ico
│  │  ├─ google-icon.png
│  │  ├─ google.png
│  │  ├─ green-cart.png
│  │  ├─ images
│  │  │  ├─ notification-on.png
│  │  │  ├─ notification.png
│  │  │  └─ user.png
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  ├─ robots.txt
│  │  └─ script.js
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ PostList.jsx
│  │  ├─ components
│  │  │  ├─ ChatComponent.scss
│  │  │  ├─ ChatComponent.tsx
│  │  │  ├─ CommunityList.tsx
│  │  │  ├─ Layout.tsx
│  │  │  ├─ UserUpdateForm.tsx
│  │  │  ├─ communityBoard
│  │  │  │  ├─ ArtistCommentItem.tsx
│  │  │  │  ├─ CommentItem.tsx
│  │  │  │  ├─ CommentList.tsx
│  │  │  │  ├─ CommunityNavigationHeader.tsx
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ Header2.tsx
│  │  │  │  ├─ PostCard.tsx
│  │  │  │  ├─ PostForm.scss
│  │  │  │  ├─ PostForm.tsx
│  │  │  │  ├─ liveHeader.tsx
│  │  │  │  └─ types.ts
│  │  │  └─ ui
│  │  │     ├─ button.tsx
│  │  │     ├─ dialog.tsx
│  │  │     ├─ input.tsx
│  │  │     └─ scroll-area.tsx
│  │  ├─ context
│  │  │  └─ ChatContext.tsx
│  │  ├─ index.css
│  │  ├─ index.tsx
│  │  ├─ lib
│  │  │  └─ utils.ts
│  │  ├─ logo.svg
│  │  ├─ pages
│  │  │  ├─ ArtistPostsBoard.tsx
│  │  │  ├─ CommunityBoard.tsx
│  │  │  ├─ LiveListPage.tsx
│  │  │  ├─ LiveStreamingPage.scss
│  │  │  ├─ LiveStreamingPage.tsx
│  │  │  ├─ LoginPage.scss
│  │  │  ├─ LoginPage.tsx
│  │  │  ├─ MainPage.scss
│  │  │  ├─ MainPage.tsx
│  │  │  ├─ SignUpPage.scss
│  │  │  ├─ SignUpPage.tsx
│  │  │  ├─ UserInfo.scss
│  │  │  ├─ UserInfo.tsx
│  │  │  ├─ board.scss
│  │  │  ├─ cart.scss
│  │  │  ├─ cart.tsx
│  │  │  ├─ media
│  │  │  │  ├─ media.scss
│  │  │  │  └─ media.tsx
│  │  │  ├─ merchandiseDetail.scss
│  │  │  ├─ merchandiseDetail.tsx
│  │  │  ├─ merchandiseList.scss
│  │  │  ├─ merchandiseList.tsx
│  │  │  └─ payments
│  │  │     └─ paymentPortone.tsx
│  │  ├─ reportWebVitals.js
│  │  ├─ services
│  │  │  └─ api.ts
│  │  ├─ setupTests.js
│  │  ├─ styles
│  │  │  ├─ CommunityList.scss
│  │  │  ├─ CommunityNavigationHeader.scss
│  │  │  ├─ Header.scss
│  │  │  ├─ PostCard.scss
│  │  │  └─ custom.scss
│  │  ├─ types
│  │  │  ├─ env.d.ts
│  │  │  ├─ portone.d.ts
│  │  │  └─ user.ts
│  │  └─ utils
│  │     ├─ isEmpty.ts
│  │     ├─ validateName.ts
│  │     └─ validatePassword.ts
│  └─ tsconfig.json
└─ package-lock.json
```
