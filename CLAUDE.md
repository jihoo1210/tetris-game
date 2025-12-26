# 🎮 Tetris Game 프로젝트

## 📋 개요
Phaser 3.60 기반 클래식 테트리스 게임.
Chrome 없이 단일 HTML 파일로 실행 가능.

## 🛠️ 기술 스택
- Phaser 3.60 CDN: https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js
- 캔버스: 400x600 (게임영역 300x600 + UI영역 100x600)
- 그리드: 10열 x 20행, 셀 크기 30px
- 목표: 60fps

## 🎮 게임 규칙
- 7가지 테트로미노: I(하늘), O(노랑), T(보라), S(초록), Z(빨강), J(파랑), L(주황)
- 점수: 1줄=100, 2줄=300, 3줄=500, 4줄=800 (레벨 배수)
- 레벨업: 10줄마다 속도 10% 증가
- 게임오버: 새 블록 스폰 불가시

## 🎹 조작법
- 좌우 방향키: 이동
- 아래 방향키: 소프트 드롭
- 위 방향키: 회전
- 스페이스바: 하드 드롭
- R키: 재시작

## 📁 폴더 구조
- backup/: Hooks가 자동 생성하는 백업
- tests/: 테스트 결과 저장
- logs/: 작업 로그

## 📏 작업 규칙
1. 단일 파일 (index.html)에 모든 코드 포함
2. Phaser CDN 사용 (설치 불필요)
3. Graphics로 도형 그리기 (이미지 없음)
4. 수정 전 백업 필수 (Hooks가 자동 처리)

## 🔌 MCP 서버 활용
- context7: Phaser API 불확실시 "use context7"로 문서 조회
- playwright: 브라우저 자동화 테스트
- sequential-thinking: 복잡한 로직 계획
- filesystem: 파일 시스템 접근 및 관리
- github: GitHub 저장소 연동 및 관리

## 🤖 에이전트 워크플로우
개발: setup → board → tetromino → controls → game (순차 1회)
품질: validator → tester → debugger (반복, 최대 10회)

## ✅ 품질 기준
- 콘솔 에러 0개
- 문법 오류 0개
- 테스트 100% 통과
- 60fps 유지
