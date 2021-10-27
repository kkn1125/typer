const typer = Typer.init({
    typer: {
        words: {
            innerTitle: ['변경도 가능하구요.', '설명을 위한 모든 부분, 또는 출력되는 모든 부분에 적용 가능합니다.', '계속해서 버그를 수정하고, 새로운 효과를 추가할 예정이니 많은 관심 부탁드립니다.'],
            box1: ['태그나 추가텍스트가 하나라도 존재하면 작동합니다.'],
        },
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
        speed: 0.1,
        delay: 1,
        loop: true,
        loopDelay: 20,
        // start: 0.3,
        // eraseMode: true,
        eraseSpeed: 0.1,
        style: {
            cursorBlink: 'horizontal'
        },
    }
});