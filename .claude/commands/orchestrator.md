---
description: 테트리스 전체 빌드 워크플로우. /project:orchestrator 로 실행한다. 개발 5단계 + 품질검증 무한반복.
allowed-tools: Read, Write, Edit, Bash, Task, mcp__context7__*, mcp__playwright__*, mcp__sequential-thinking__*, mcp__filesystem__*, mcp__github__*
---

# 테트리스 빌드 오케스트레이터

## 개요
이 워크플로우는 테트리스 게임을 자동으로 빌드한다.
- PHASE 1: 개발 (5개 에이전트 순차 실행)
- PHASE 2: 품질 검증 (3개 에이전트 반복, 최대 10회)


## MCP 활용 전략

### Context7
- 모든 개발 에이전트는 Phaser API 사용 전 context7로 문서 조회
- resolve-library-id → get-library-docs 순서

### Playwright
- tester 에이전트에서 브라우저 자동화 테스트
- browser_navigate, browser_snapshot, browser_console_messages

### Sequential-thinking
- 복잡한 로직 설계 시 단계별 사고
- setup, game 에이전트에서 활용

### GitHub
- 주요 마일스톤마다 커밋
- PHASE 1 완료 후, PHASE 2 완료 후 push


## PHASE 1: 개발 (순차 실행, 1회)

Task tool로 각 에이전트를 순서대로 호출한다.
각 에이전트는 skills: phaser-tetris 를 참조한다.

### 1단계: setup 에이전트
Task tool로 .claude/agents/setup.md 실행

작업:
- index.html 기본 구조 생성
- Phaser 3.60 CDN 연결
- 400x600 캔버스 설정
- 전역 변수 선언부 준비
- context7로 Phaser config 최신 문법 확인

완료 조건:
- index.html 파일 존재
- 브라우저에서 빈 캔버스 표시


### 2단계: board 에이전트
Task tool로 .claude/agents/board.md 실행

작업:
- 10x20 그리드 시스템 구현
- 보드 배열 초기화
- drawBoard() 함수 구현
- drawCell() 함수 구현
- context7로 Graphics API 확인

완료 조건:
- 그리드 시각적으로 표시
- 콘솔 에러 없음


### 3단계: tetromino 에이전트
Task tool로 .claude/agents/tetromino.md 실행

작업:
- 7가지 테트로미노 정의
- SRS 회전 시스템 구현
- Wall Kick 구현
- 7-Bag Randomizer 구현
- spawnPiece() 함수
- drawCurrentPiece() 함수

완료 조건:
- 블록 스폰 및 표시
- 회전 정상 동작


### 4단계: controls 에이전트
Task tool로 .claude/agents/controls.md 실행

작업:
- 키보드 입력 처리
- 좌우 이동 (← →)
- 소프트 드롭 (↓)
- 회전 (↑)
- 하드 드롭 (Space)
- 재시작 (R)
- context7로 Input.Keyboard API 확인

완료 조건:
- 모든 키 정상 동작
- 충돌 시 이동 불가


### 5단계: game 에이전트
Task tool로 .claude/agents/game.md 실행

작업:
- 자동 낙하 타이머
- lockPiece() - 블록 고정
- clearLines() - 라인 클리어
- 점수/레벨 시스템
- 게임오버 감지
- restart() 함수
- UI 표시 (점수, 레벨, 다음 블록)
- context7로 Time.addEvent API 확인

완료 조건:
- 게임 플레이 가능
- 라인 클리어 동작
- 게임오버/재시작 동작


### PHASE 1 완료 후
GitHub에 커밋 및 push:
- 메시지: "PHASE 1 완료: 기본 게임 구현"


## PHASE 2: 품질 검증 (반복, 최대 10회)

### 종료 조건
- 콘솔 에러 0개
- 문법 오류 0개
- 테스트 100% 통과
- 60fps 유지

### 반복 순서

1. validator 에이전트 실행
   Task tool로 .claude/agents/validator.md 실행
   - 코드 검사만 수행
   - 절대 코드 수정 금지
   - 결과를 logs/validator.log에 저장

2. tester 에이전트 실행
   Task tool로 .claude/agents/tester.md 실행
   - Playwright MCP로 브라우저 테스트
   - 테스트만 수행, 코드 수정 금지
   - 결과를 tests/test_result.json에 저장

3. 오류 판단
   - validator.log와 test_result.json 확인
   - 오류 있으면 → 4번으로
   - 오류 없으면 → 5번으로

4. debugger 에이전트 실행
   Task tool로 .claude/agents/debugger.md 실행
   - 발견된 오류 수정
   - 한 번에 하나의 문제만 수정
   - 1번으로 돌아가기

5. 완료!
   - "BUILD SUCCESS" 출력
   - GitHub에 커밋 및 push
   - 메시지: "PHASE 2 완료: 품질 검증 통과"


## 참조 문서
- CLAUDE.md: 프로젝트 규칙
- .claude/skills/phaser-tetris/SKILL.md: 기술 패턴 및 가이드라인
