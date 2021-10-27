# Update List

- [Update List](#update-list)
  - [0.2.0 버그 수정 및 업데이트](#020-버그-수정-및-업데이트)
    - [버그 수정](#버그-수정)
    - [변경 사항](#변경-사항)
    - [추가 사항](#추가-사항)
    - [예정사항](#예정사항)

## 0.2.0 버그 수정 및 업데이트

### 버그 수정

1. custom, words옵션 설정이 없으면 작동이 안되는 버그 수정
2. start, delay, speed 오작동 버그 수정

### 변경 사항

1. 기존 `dataset`명칭 `lang`에서 `typer`로 변경
2. 변경, 수정사항이 많아 0.2.0로 부버전 변경
3. typer 초기화 옵션중 custom(배열/array)에서 custom(객체/obj)방식으로 변경
4. 에러 출력 방식 변경
   1. 텍스트가 innerText와 initOption의 words속성이 둘다 없으면 에러 출력
5. CSS적용 방식 변경

### 추가 사항

1. typer전용 css
2. 타이핑 효과(커서 깜빡임 효과)
3. 커서 깜빡임 전역, 단일 설정 가능 (개별로 끄기 가능)
4. Typer Docs 페이지 생성

### 예정사항

1. typer애니메이션 (폰트별 애니메이션) 예정

***kimson 2021-10-27 19:55:45***

-----