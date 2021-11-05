# typer

한글 및 영문, 문자, 특수문자를 타자순으로 입력하는 효과를 쉽게 만들어 주는 어플리케이션

## 사용법

자바스크립트를 잘 모르는 사람도 사용하기 쉽도록 옵션과 명령어를 준비했습니다.

크게 설정 방법은 두 가지입니다.

첫 번째는 `html tag`에 직접 `data-lang-*` 속성을 주는 방법입니다.
두 번째는 `typer`의 초기화 옵션에 추가하는 것입니다.

```html
<body>

    ...

    <script src="typer.js"></script>
    <script src="index.js"></script>
</body>
```

### CDN 사용

```html
<!-- v1.0.0 -->


<!-- v0.2.1 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kkn1125/typer@update-v021/typer.css" integrity="sha384-WlGS/BGsTdvbKjfrZ9IJE45xkq8xElk1ASfEwycwMlwu0DO+shSOgBF/odcC4afX" crossorigin="anonymous">

<script src="https://cdn.jsdelivr.net/gh/kkn1125/typer@update-v021/typer.js" integrity="sha384-s62GQWchBcBh82YhldUNQK9Cqw6iFB+eBau07ihjICofE7TLkSimbCI4+djd4soo" crossorigin="anonymous"></script>

<!-- v0.2.0 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kkn1125/typer@update-v020/typer.css" integrity="sha384-VbWnIJQSG+E1SZUWa0XR8wgy50XDwAcF9A0vNbtXqGvWUP9BiHJg8L3UFXQv9a14" crossorigin="anonymous">

<script src="https://cdn.jsdelivr.net/gh/kkn1125/typer@update-v020/typer.js" integrity="sha384-TjFbiXfZsWbm5r2BN+wk//8Y2G4UW+IJTvn+Hi69spImwbD0+SLOA55rMC2ScW10" crossorigin="anonymous"></script>

<!-- v0.1.0 -->
<script src="https://cdn.jsdelivr.net/gh/kkn1125/typer@patch-010/typer.js" integrity="sha384-eZvVxdQh+LsT366wiWMLC32Lmq4Ys6A8dAdS7kzgRuMINWnKzEBZ2JpyT1tvnLRs" crossorigin="anonymous"></script>
```

### 초기화 옵션 설정

```javascript
// index.js
const typer = Typer.init({
    typer: {
        // data-typer-name 지정태그에 텍스트 추가 모습
        words: {
            tp:
                ['순차적으로',
                '텍스트가 입력됩니다.',
                '물론 한글을 분해되고 나머지 문자는',
                '알아서 Writing 됩니다!']
            ,
            hangul: '1회 작성은 배열없이 가능합니다.'
        },
        // 태그 id를 지정하여 텍스트 및 옵션을 추가하는 모습
        custom: {
            test: {
                words: ['계속 변경될 수 있습니다.'],
                dataset: {
                    speed: 0.05,
                    delay: 1,
                    loop: true,
                    loopDelay: 1,
                    eraseMode: true,
                    eraseSpeed: 0.1,
                    realTyping: true,
                }
            },
            test2: {
                words: ['지금은 다른 이름'],
                dataset: {
                    speed: 0.05,
                    delay: 1,
                    loop: true,
                    loopDelay: 1,
                    eraseMode: true,
                    eraseSpeed: 0.1,
                }
            }
        },
        // 전역 스타일 값 지정
        speed: 0.1,
        delay: 1,
        loop: false,
        loopDelay: 1,
        start: 0,
        eraseMode: false,
        eraseSpeed: 0.1,
        realTyping: false,
        style: {
            cursorBlink: 'vertical'
        },
    }
})
```

|구분|명칭|기능|기본값|단위|
|---|---|---|---|---|
|1|words|타이핑 효과가 끝난 뒤 이어서 나오는 텍스트를 설정합니다.|-|s|
|ㄴ|`data-lang-name`의 속성 이름(ex. test)|data-lang-name="test"를 가진 태그에 텍스트를 추가합니다.|-|
|2|custom|`data-lang-*`속성 외 `id` > `className` > `tagName`순으로 태그를 찾아 타이핑 효과를 부여합니다. speed등의 속성은 `data-lang-*`과 동일하며, `words`에 배열 또는 단일 텍스트 입력이 가능합니다.|-||
|3|speed|타이핑 객체 전역의 타이핑 속도를 지정합니다.|0.1|s|
|4|delay|타이핑 객체 전역의 다음 텍스트로 변경되는 지연 속도를 지정합니다.|1|s|
|ㄴ|`example`|'테스트' -> 1초후 -> '테스트 다음 글 타이핑 시작'||
|5|loop|타이핑 객체 전역의 타이핑 텍스트들을 무한으로 반복시킵니다.|false|boolean|
|6|loopDelay|타이핑 객체 전역의 타이핑 텍스트들을 반복할 때 지연시간을 지정합니다.|1|s|
|ㄴ|`example`|'텍스트1' -> delay -> '텍스트2' -> looDelay -> '텍스트1' ...||
|7|start|타이핑 객체 전역의 타이핑 시작시간을 지연합니다.|1|s|
|8|eraseMode|타이핑 객체 전역의 eraseMode 적용을 합니다.|false|boolean|
|9|eraseSpeed|타이핑 객체 전역의 erase 속도를 지정합니다.|0.1|s|
|10|realTyping|타이핑 객체 전역의 실제 타이핑 효과를 적용합니다|false|boolean|
|11|style|타이핑 관련 css를 전역에 지정합니다.|-||
|ㄴ|cursorBlink|커서 깜빡임 스타일을 지정합니다.|'vertical'|string|

### 태그 속성 값 설정

기본 속성 이름은 `data-lang-*`입니다.

|구분|명칭|기능|기본값|단위|
|---|---|---|---|---|
|1|name|타이핑 타겟 태그에 이름을 부여합니다.|전역옵션|string|
|2|speed|대상 태그의 타이핑 속도를 지정합니다.|전역옵션|s|
|3|delay|대상 태그의 다음 타이핑을 지연합니다.|전역옵션|s|
|4|loop|대상 태그의 타이핑 반복을 지정합니다|전역옵션|boolean|
|5|loopDelay|대상 태그의 타이핑 반복을 지연합니다.|전역옵션|s|
|6|start|대상 태그의 타이핑 시작을 지연시킵니다.|전역옵션|s|
|7|eraseMode|대상 태그의 다음 타이핑으로 넘어가기 전 지우는 효과를 적용합니다.|전역옵션|boolean|
|8|eraseSpeed|대상 태그의 타이핑 eraseMode 속도를 지정합니다.|전역옵션|s|
|9|realTyping|대상 태그의 실제 타이핑 효과를 적용합니다|전역옵션|boolean|
|10|cursorBlink|대상 태그의 타이핑 css를 단일 지정합니다.|전역옵션|string|


### 기본 원리

`data-lang-*`속성을 우선 탐색하여 타이핑 효과를 지원합니다. `data-lang-*`속성 값이 우선 적용되며, 전역 속성인 초기화 옵션 값이 다음 적용됩니다. id>className>tagName도 지원하며 원하는 텍스트를 적고, 타이핑 속도, 다음 글 지연, 다음 루프 지연, 루프 사용여부 를 설정할 수 있습니다.

각 타이핑 정보는 분해, 재조합 과정을 거치는데 재조합 과정에서 한글의 경우 실제 타이핑 되는 3단계를 나누어 저장됩니다. 저장된 타이핑 정보는 하나의 번들로 묶여 각 번들이 타이핑을 하는 메서드를 내포하여 작동되게 됩니다.

## 기여

오픈소스이면서 완성도를 조금씩 높여나가고자 합니다. 기여에 대한 지식이 부족해서 경험자 분들에게 조언을 구하고 싶습니다. issue나 메일로 버그 또는 제안사항 등을 주신다면 충분한 검토와 의견을 감사히 받아 개발하겠습니다.

## Contact

[Blog](https://kkn1125.github.io/)
[Email](https://kkn1125.github.io/contact)