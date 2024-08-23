# 🖥️ Team 오물조물 NodeJs 최종 프로젝트

![TGSrd-removebg-preview](https://github.com/user-attachments/assets/a69e6e9a-2d34-4fca-b52f-e44a5a037626)

## 📌 목차

- 프로젝트 소개
- 프로젝트 설명
- 팀원 구성
- 개발 기간
- 개발 환경
- API 명세서 및 ERD
- 파일 구조
- 주요 기능 및 설명
- 트러블 슈팅
- 소감

---

## 📌 프로젝트 소개

- 프로젝트 이름 : 최종 프로젝트 Flant
- 내용 : NestJs를 이용한 최종프로젝트
- 구분 : 팀 프로젝트
- GitHub : https://github.com/lemonpie313/sparta_final_project
- 시연 영상 :
- 배포 : https://flat.club

---

## 📌 프로젝트 설명

<h4>Flant는 팬들을 위한 커뮤니티 플랫폼입니다.</h4>
<h4>팬들이 아티스트와 소통하고, 최신 소식과 콘텐츠를 공유하며</h4>
<h4>팬들 간의 활발한 교류를 나눌 수 있는 공간을 제공합니다.</h4>
<h4>누구에게나 쉽게 접근하고 이용할 수 있는 플랫폼을 목표로 Flant를 만들었습니다.</h4>

---

## 👨‍👨‍👦‍👦 팀원 구성

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/CMINSOO"><img src="https://avatars.githubusercontent.com/u/101718150?v=4" width="100px;" alt="서동현"/><br /><sub><b> 리더 : 서동현 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/ysys29"><img src="https://avatars.githubusercontent.com/u/156773875?v=4" width="100px;" alt="진수현"/><br /><sub><b> 부리더:진수현 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/NohSiHeon"><img src="https://avatars.githubusercontent.com/u/165770132?v=4" width="100px;" alt="김호연"/><br /><sub><b> 팀원 : 김호연 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/gus11als"><img src="https://avatars.githubusercontent.com/u/67359937?v=4" width="100px;" alt="황소은"/><br /><sub><b> 팀원 : 황소은 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/devJaem"><img src="https://avatars.githubusercontent.com/u/166608551?v=4" width="100px;" alt="이성운"/><br /><sub><b> 팀원 : 이성운 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/devJaem"><img src="https://avatars.githubusercontent.com/u/145142726?v=4" width="100px;" alt="이민준"/><br /><sub><b> 팀원 : 이민준 </b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

## 📌 개발 기간

2024.07.19 ~ 2024.08.26

---

## 📌 개발 환경

- 운영체제 :
  ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
  ![macOS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=macos&logoColor=F0F0F0)
- BackEnd : ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
- FrontEnd : ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- Tool : ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) ![Insomnia](https://img.shields.io/badge/Insomnia-black?style=for-the-badge&logo=insomnia&logoColor=5849BE)![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)
  ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
  ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
- Publish : ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

---

## 📌 API 명세서 및 ERD 와이어 프레임

- API 명세서
- 추후 이미지 삽입 예정

- ERD
  ![image](https://github.com/user-attachments/assets/5420d622-974c-417f-8769-82eb9d8d0671)

## 📌 폴더 구조

```
.
├── dev
├── nest-cli.json
├── package-lock.json
├── package.json
├── public
│   └── toss.html
├── report.json
├── src
│   ├── admin
│   ├── all-exceptions.filter.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── auth
│   ├── cart
│   ├── chat
│   ├── comment
│   ├── community
│   ├── configs
│   ├── constants
│   ├── data-source.ts
│   ├── database
│   ├── factory
│   ├── filters
│   ├── form
│   ├── like
│   ├── live
│   ├── main.ts
│   ├── media
│   ├── membership
│   ├── merchandise
│   ├── notice
│   ├── notification
│   ├── order
│   ├── post
│   ├── user
│   ├── util
│   └── webhook.interceptor.ts
├── test
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
│   ├── live.scenario.yml
│   ├── posts.scenario.yml
│   └── users.csv
├── tsconfig.build.json
├── tsconfig.json
```

## 📌 주요 기능 및 설명

 <details><summary>1. 관리자

</summary>

- 아티스트 생성 / 삭제

- 매니저 생성 / 삭제
</details>

<details><summary>2. 인증

</summary>

- 회원가입

- 로그인

- 로그아웃

</details>

<details><summary>3. 사용자
</summary>

- 내 정보 조회

- 패스워드 확인

- 내 정보 수정

- 회원 탈퇴

</details>
<details><summary>4. 커뮤니티
</summary>

- 커뮤니티 생성

- 커뮤니티 전체 및 상세 조회

- 커뮤니티 수정

- 커뮤니티 삭제

- 커뮤니티 가입

- 내가 가입한 커뮤니티 조회

- 로고 및 커버 이미지 수정
</details>
<details><summary>5. 게시글
</summary>

- 게시글 생성

- 게시글 전체 및 상세 조회

- 게시글 수정

- 게시글 삭제

- 게시글 좋아요 확인
</details>
<details><summary>6. 댓글
</summary>

- 댓글 생성

- 댓글 전체 및 상세 조회

- 댓글 수정

- 댓글 삭제
</details>
</details>
<details><summary>7. 미디어
</summary>

- 미디어 생성

- 미디어 전체 및 상세 조회

- 미디어 수정

- 미디어 삭제

- 썸네일 이미지 수정
</details>
</details>
<details><summary>8. 멤버십
</summary>

- 멤버십 가입
</details>
</details>
<details><summary>9. 좋아요 기능
</summary>

- 커뮤니티 좋아요

- 댓글 좋아요

- 좋아요 개수 조회
</details>
</details>
<details><summary>10. 상품
</summary>

- 상품 생성

- 상품 전체 및 상세 조회

- 상품 수정

- 상품 삭제
</details>
</details>
</details>
<details><summary>11. 장바구니
</summary>

- 카트 생성

- 카트 전체 조회

- 카트아이템 삭제

- 상품 수량 수정
</details>
</details>
</details>
<details><summary>12. 주문
</summary>

- 주문 생성

- 주문 전체 및 상세 조회
</details>

## 📌 트러블 슈팅

## 📌 어려웠던 점 및 소감
