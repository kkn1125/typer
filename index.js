const typer = Typer.init({
    typer: {
        words: {
            tp: 
                ['test', '모두까기인형꺆', 'added wordsㅕㅕ']
            ,
            hangul: 'wow'
        },
        custom:[
            {
                name:'test',
                words:['wow'],
                dataset:{
                    speed: 1,
                    delay: 1,
                    loop: false,
                    loopDelay: 1,
                }
            }
        ],
        speed: 0.1,
        delay: 1,
        loop: true,
        loopDelay: 20,
    }
});