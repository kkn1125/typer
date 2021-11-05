/**
 * Typing v1.0.0 (https://github.com/kkn1125/typer)
 * Copyright 2021 The Typer Authors kimson
 * Licensed under MIT (https://github.com/kkn1125/typer/blob/main/LICENSE)
 */
'use strict';

const Typer = (function () {
    function Controller() {
        let moduleModel = null;
        let uiElem = null;

        this.init = function (model, ui) {
            moduleModel = model;
            uiElem = ui;

            window.addEventListener('load', this.readyToWriting);
        }

        this.readyToWriting = function (ev) {
            try {
                moduleModel.validTarget();
            } catch (e) {
                console.error(e.message);
                return;
            }
            moduleModel.readyToWriting(ev);
        }
    }

    function Model() {
        let moduleView = null;
        let moduleHangul = null;
        let initOptions = null;
        let typingBundle = [];
        let writableData = [];
        let writableCustomData = [];

        this.init = function (view, hangul, options) {
            initOptions = options;
            moduleView = view;
            moduleHangul = hangul;

            this.findWritableDataInWeb();
            this.applyStyleToWritableData(initOptions.typer.style);
        }

        this.applyStyleToWritableData = function (style) {
            if (style){
                typingBundle.forEach(item => {
                    for (let st in style) {
                        let upper = st.charAt().toUpperCase() + st.slice(1);
                        if (!item.target.dataset[`typer${upper}`])
                            item.target.dataset[`typer${upper}`] = style[st];
                    }
                });
            }
        }

        this.findWritableDataInWeb = function () {
            this.findWritableData();
            for (let item of writableData) {
                let data = item.dataset;
                this.createTypingSource({
                    name: data.typerName,
                    words: item.innerHTML,
                    speed: data.typerSpeed
                });
            }
            if (initOptions.typer.custom) this.requestCustomizeTyping();
        }

        this.findWritableData = function () {
            writableData = [...document.querySelectorAll('[data-typer-name]')];
        }

        this.requestCustomizeTyping = function () {
            let addedWords = [];
            let target, separatedWords, readyToTyping, concatText, words;
            let custom = initOptions.typer.custom;
            for (let item in custom) {
                let innerHTML = custom[item].words;
                try {
                    target = this.validTargetByName(item);
                    if (target.getAttribute('typer-exam') != null) continue;
                    let dataset = target.dataset;
                    for (let data in custom[item].dataset) {
                        let typerData = 'typer' + data.charAt().toUpperCase() + data.slice(1);
                        dataset[typerData] = custom[item].dataset[data];
                    }
                } catch (e) {
                    console.error(e.message);
                    return;
                }

                if (target.innerHTML) {
                    words = target.innerHTML.trim();
                    separatedWords = this.getSeparate(words);
                    readyToTyping = this.getTyping(separatedWords);
                    concatText = this.getConcat(readyToTyping) || null;

                }
                if (innerHTML) {
                    if (typeof innerHTML == 'string') {
                        addedWords.push(this.getConcat(this.getTyping(this.getSeparate(innerHTML))));
                    } else {
                        innerHTML.forEach(words => {
                            if (words != '') words = words.trim();
                            addedWords.push(this.getConcat(this.getTyping(this.getSeparate(words))));
                        });
                    }

                }
                writableCustomData.push(target);
            }

            for (let item of writableCustomData) {
                let data = item.dataset;
                data.typerName = item.id;
                this.createTypingSource({
                    name: data.typerName,
                    words: item.innerHTML,
                    speed: data.typerSpeed
                });
            }
        }

        this.validTargetByName = function (name) {
            let target = document.getElementById(name) || document.querySelector(`.${name}`) || document.querySelector(`${name}`);
            if (!target) {
                throw new Error('[NoTargetException] 지정한 타겟 중 찾지 못한 타겟이 있습니다.');
            }
            return target;
        }

        this.readyToWriting = function (ev) {
            this.writeByOrdered();
        }

        this.writeByOrdered = function () {
            for (let ord in typingBundle) {
                let target = typingBundle[ord];
                let startTime = target.target.dataset.typerStart ? parseFloat(target.target.dataset.typerStart) : initOptions.typer.start;
                if (!startTime) startTime = 0;
                target.target.innerHTML = '';
                if (startTime) {
                    setTimeout(() => {
                        target.write();
                    }, (startTime * 1000));
                } else {
                    target.write();
                }
            }
        }

        this.getInnerHTMLByName = function (name) {
            return (this.getTargetByName(name)).innerHTML;
        }

        this.createTypingSource = function (item) {
            let target = this.getTargetByName(item.name);
            let words = item.words.trim();
            let separatedWords = this.getSeparate(words);
            let readyToTyping = this.getTyping(separatedWords);
            let addedWords = [];
            let innerHTML = '';

            if (initOptions.typer.words && initOptions.typer.words[item.name]) innerHTML = initOptions.typer.words[item.name];
            else if (initOptions.typer.custom && initOptions.typer.custom[item.name]) innerHTML = initOptions.typer.custom[item.name].words;

            if (innerHTML) {
                if (typeof innerHTML == 'string') {
                    addedWords.push(this.getConcat(this.getTyping(this.getSeparate(innerHTML))));
                } else {
                    innerHTML.forEach(words => {
                        if (words) words = words.trim();
                        addedWords.push(this.getConcat(this.getTyping(this.getSeparate(words))));
                    });
                }
            }

            if (!words) {
                try {
                    if (typeof innerHTML == 'string' && innerHTML.trim() == '') {
                        target.style.cssText = `
                            color: red;
                        `;
                        words = '타겟에 지정된 내용이 없습니다.';
                        addedWords.push(this.getConcat(this.getTyping(this.getSeparate(words))));
                        target.dataset.typerLoop="false";
                        throw new Error(`[NoTextException] ${words} 타겟명 : ${item.name}`);
                    } else {
                        words = innerHTML;
                    }
                } catch (e) {
                    console.error(e.message);
                }
            }

            typingBundle.push(new this.TypingItem(target, [this.getConcat(readyToTyping), ...addedWords], item));
        }

        this.TypingItem = function (target, typing, item) {
            this.order = 0;
            this.target = target;
            this.typing = typing.filter(t => t.length != 0);
            this.write = function () {
                let data = target.dataset;
                let loop = data.typerLoop ? (data.typerLoop == 'false' ? false : true) : initOptions.typer.loop;
                let speed = data.typerSpeed != undefined ? parseFloat(data.typerSpeed) : initOptions.typer.speed;
                let delay = data.typerDelay != undefined ? parseFloat(data.typerDelay) : initOptions.typer.delay;
                let loopDelay = data.typerLoopDelay ? parseFloat(data.typerLoopDelay) : initOptions.typer.loopDelay;
                let eraseMode = data.typerEraseMode ? (data.typerEraseMode == 'false' ? false : true) : initOptions.typer.eraseMode;
                let eraseSpeed = data.typerEraseSpeed ? parseFloat(data.typerEraseSpeed) : initOptions.typer.eraseSpeed;
                let realTyping = data.typerRealTyping ? (data.typerRealTyping == 'false' ? false : true) : initOptions.typer.realTyping;
                if (delay < 1) delay = 1;
                if (loopDelay < 1) loopDelay = 1;

                moduleView.doWriting(this.target, this.typing[this.order], speed, realTyping, isReturn.bind(this));

                function isReturn(fullText) {
                    if (eraseMode) {
                        setTimeout(() => {
                            eraseTextContent(fullText, this);
                        }, 2000);
                    } else restartLoop(this);
                }

                function eraseTextContent(fullText, root) {
                    let textSplit = fullText.split('');
                    let eraseText = setInterval(() => {
                        textSplit.pop();
                        if (textSplit.length <= 0) {
                            clearInterval(eraseText);
                            restartLoop(root);
                        };
                        root.target.innerHTML = textSplit.join('');
                    }, eraseSpeed * 1000);
                }

                function restartLoop(root) {
                    setTimeout(() => {
                        root.order++;
                        if (root.typing[root.order]) {
                            root.write();
                        } else {
                            if (loop) {
                                setTimeout(() => {
                                    root.order = 0;
                                    root.write();
                                }, (loopDelay * 1000));
                            }
                        }
                    }, (delay * 1000));
                }
            }
        }

        this.getSeparate = function (data) {
            let ref = [];
            let firstFilter = data.split(/(.*?)/u).filter(x => x != '');
            firstFilter.forEach(x => {
                let math = x.charCodeAt() - 44032;
                let ft = Math.floor(math / 588);
                let mt = Math.floor((math - (ft * 588)) / 28);
                let lt = Math.floor(math % 28);
                if (math < 0 || math > 11171) ref.push(x);
                else ref.push([moduleHangul.f[ft], moduleHangul.m[mt], moduleHangul.l[lt]]);
            });
            return ref;
        }

        this.getConcat = function (data) {
            let ref = [];
            data.forEach(x => {
                let tmp = [];
                if (x[0] instanceof Array) {
                    x.forEach(a => {
                        let sf = moduleHangul.f.indexOf(a[0]) * 588;
                        let sm = moduleHangul.m.indexOf(a[1]) * 28;
                        let sl = moduleHangul.l.indexOf(a[2]) % 28;
                        if (a[1] == '' && a[2] == '') {
                            tmp.push(moduleHangul.f[moduleHangul.f.indexOf(a[0])]);
                        } else {
                            tmp.push(String.fromCharCode(sf + sm + sl + 44032));
                        }
                    });
                } else {
                    if (x.length !== 3) tmp.push(x[0]);
                    else {
                        let sf = moduleHangul.f.indexOf(x[0]) * 588;
                        let sm = moduleHangul.m.indexOf(x[1]) * 28;
                        let sl = moduleHangul.l.indexOf(x[2]) % 28;
                        if (x[1] == '' && x[2] == '') {
                            tmp.push(moduleHangul.f[moduleHangul.f.indexOf(x[0])]);
                        } else {
                            tmp.push(String.fromCharCode(sf + sm + sl + 44032));
                        }
                    }
                }
                ref.push(tmp);
            });
            return ref;
        }

        this.getTyping = function (data) {
            let ref = [];
            data.forEach(x => {
                if (!(x instanceof Array)) {
                    ref = [...ref, [x]];
                } else {
                    let a = [x[0], '', ''];
                    let b = [x[0], x[1], ''];
                    let c = [x[0], x[1], x[2]];
                    if (x[2] != '') {
                        ref = [...ref, [a, b, c]];
                    } else {
                        ref = [...ref, [a, b]];
                    }
                }
            });
            return ref;
        }

        this.validTarget = function () {
            for (let typingItem of typingBundle) {
                let target = typingItem.target;
                if (!target.dataset.typerName) continue;
                if (target.dataset.typerName.match(/[^rㄱ-힣\w\-]/gm)) {
                    throw new Error(`[NoTargetException] 지정한 타겟 중 특수문자가 포함되어 있습니다. 특수문자를 제외한 이름으로 지정해주세요. 타겟명: ${target.dataset.typerName}`);
                }
            };
        }

        this.getTargetByName = function (name) {
            return document.querySelector(`[data-typer-name="${name}"]`);
        }

        this.getTargetByOrder = function (order) {
            let name = initOptions.typer.words[order].name;
            return this.getTargetByName(name);
        }
    }

    function View() {
        let uiElem = null;

        this.init = function (ui) {
            uiElem = ui;
        }

        this.doWriting = function (target, data, speed, realTyping, callBack) {
            let initDisplay = requestAnimationFrame(this.initializeDisplay.bind(this, target));
            let tmp = '',
                repo = '',
                i = 0,
                q = 0;

            let tps = setInterval(() => {
                if(realTyping){
                    if(Math.random()*60>45){
                        q--;
                        setTimeout(()=>{
                            if(Math.random()*50>47){
                                q-=2;
                            }
                        }, parseInt(Math.random()*10))
                    }
                }

                try {
                    if (data.length == 0) {
                        clearInterval(tps);
                        throw new Error(`[NoDataException] 내용이 없습니다. 타겟명: ${target.dataset.typerName}`);
                    }
                } catch (e) {
                    console.error(e.message);
                    return;
                }
                if (target.tagName == 'TITLE') tmp = `${data[i][q]}`;
                else tmp = `<span>${data[i][q]?data[i][q]:''}</span>`;
                q++;
                target.innerHTML = repo + tmp;
                if (q > data[i].length - 1) {
                    q = 0;
                    i++;
                    repo += tmp;
                }
                if (i > data.length - 1) {
                    callBack(target.innerText);
                    clearInterval(tps);
                }
            }, speed * 1000);
        }

        this.initializeDisplay = function(target){
            let style = null;
            style = getComputedStyle(target)['opacity'];
            if(style === '0'){
                target.style.transition = '300ms';
                target.dataset.typerWriteMode = 'on';
                cancelAnimationFrame(0);
            } else {
                requestAnimationFrame(this.initializeDisplay.bind(this, target));
            }
        }
    }

    return {
        init: function (options) {
            const body = document.body;
            const hangul = this.requireHangul();
            options = this.initializeOptions(options);
            const ui = {
                body
            }

            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(ui);
            model.init(view, hangul, options);
            controller.init(model, ui);
        },
        requireHangul: function () {
            return new(function Hangul() {
                this.f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
                this.m = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
                this.l = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
            })();
        },
        initializeOptions: function (options) {
            let initOptions = {
                typer: {
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
            }

            function asyncOptions(init, obj) {
                for (let op in obj) {
                    if (obj[op] instanceof Object && !(obj[op] instanceof Array) && op != 'words' && op != 'custom') {
                        asyncOptions(init[op], obj[op]);
                    } else {
                        init[op] = obj[op];
                    }
                }
            }
            asyncOptions(initOptions, options);
            return initOptions;
        }
    }
})();