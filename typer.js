/**
 * Typing v0.1.0 (https://github.com/kkn1125/typer)
 * Copyright 2021 The Typer Authors
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

        this.readyToWriting = function(ev){
            try{
                moduleModel.validTarget();
            } catch(e){
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

        this.init = function (view, hangul, options) {
            initOptions = options;
            moduleView = view;
            moduleHangul = hangul;

            this.findWritableDataInWeb();
        }

        this.findWritableDataInWeb = function(){
            this.findWritableData();
            for(let item of writableData){
                let data = item.dataset;
                this.createTypingSource({name:data.langName, words: item.innerHTML, speed: data.langSpeed});
            }
            this.requestCustomizeTyping();
        }

        this.findWritableData = function(){
            writableData = [...document.querySelectorAll('[data-lang-name]')];
        }

        this.requestCustomizeTyping = function(){
            let addedWords = [];
            let target = '';
            
            for(let item of initOptions.typer.custom){
                let innerHTML = item.words;
                try{
                    target = this.validTargetByName(item.name);
                    let dataset = target.dataset;
                    for(let data in item.dataset){
                        let langData = 'lang'+data.charAt().toUpperCase()+data.slice(1);
                        console.log(langData)
                        dataset[langData] = item.dataset[data];
                    }
                    console.log(target)
                } catch(e){
                    console.error(e.message);
                    return;
                }
                if(innerHTML){
                    if(typeof innerHTML == 'string'){
                        addedWords.push(this.getConcat(this.getTyping(this.getSeparate(innerHTML))));
                    } else {
                        innerHTML.forEach(words=>{
                            addedWords.push(this.getConcat(this.getTyping(this.getSeparate(words))));
                        });
                    }
                }
            }
            typingBundle.push(new this.TypingItem(target, [...addedWords], initOptions));
            console.log(typingBundle)
        }

        this.validTargetByName = function(name){
            let target =  document.getElementById(name) || document.querySelector(`.${name}`) || document.querySelector(`${name}`);
            if(!target){
                throw new Error('[NoTargetException] 지정한 타겟 중 찾지 못한 타겟이 있습니다.');
            }
            return target;
        }

        this.readyToWriting = function(ev){
            this.writeByOrdered();
        }

        this.writeByOrdered = function(){
            for(let ord in typingBundle){
                let target = typingBundle[ord];
                let startTime = target.target.dataset.langStart?parseFloat(target.target.dataset.langStart):initOptions.typer.start;
                if(!startTime) startTime = 0;
                target.target.innerHTML = '';
                if(startTime!=undefined){
                    setTimeout(()=>{
                        target.write();
                    }, startTime * 1000);
                } else {
                    target.write();
                }
            }
        }

        this.getInnerHTMLByName = function(name){
            return (this.getTargetByName(name)).innerHTML;
        }

        this.createTypingSource = function(item){
            let target = this.getTargetByName(item.name);
            let words = item.words;
            let separatedWords = this.getSeparate(words);
            let readyToTyping = this.getTyping(separatedWords);
            let addedWords = [];
            let innerHTML = initOptions.typer.words[item.name];

            if(innerHTML){
                if(typeof innerHTML == 'string'){
                    addedWords.push(this.getConcat(this.getTyping(this.getSeparate(innerHTML))));
                } else {
                    innerHTML.forEach(words=>{
                        addedWords.push(this.getConcat(this.getTyping(this.getSeparate(words))));
                    });
                }
            }

            if(!words) {
                try{
                    if(innerHTML.trim()==''){
                        target.style.cssText = `
                            color: red;
                        `;
                        words = '타겟에 지정된 내용이 없습니다.';
                        throw new Error(`[NoTextException] ${words} 타겟명 : ${item.name}`);
                    } else {
                        words = innerHTML;
                    }
                } catch(e){
                    console.error(e.message);
                }
            }
            
            typingBundle.push(new this.TypingItem(target, [this.getConcat(readyToTyping), ...addedWords], item));
        }

        this.TypingItem = function (target, typing, item){
            this.order = 0;
            this.target = target;
            this.typing = typing;
            this.write = function(){
                let data = target.dataset;
                let loop = data.langLoop?(data.langLoop=='false'?false:true):initOptions.typer.loop;
                let speed = data.langSpeed!=undefined?parseFloat(data.langSpeed):initOptions.typer.speed;
                let delay = data.langDelay!=undefined?parseFloat(data.langDelay):initOptions.typer.delay;
                let loopDelay = data.langLoopDelay?parseFloat(data.langLoopDelay):initOptions.typer.loopDelay;
                if(delay<1) delay = 1;
                if(loopDelay<1) loopDelay = 1;
                moduleView.doWriting(this.target, this.typing[this.order], speed, isReturn.bind(this));
                function isReturn(){
                    setTimeout(()=>{
                        this.order++;
                        if(this.typing[this.order]){
                            this.write();
                        } else {
                            if(loop){
                                setTimeout(()=>{
                                    this.order = 0;
                                    this.write();
                                }, loopDelay*1000);
                            }
                        }
                    }, delay * 1000)
                }
            }
        }

        this.getSeparate = function(data){
            let ref = [];
            data.split('').forEach(x=>{
                let math = x.charCodeAt()-44032;
                let ft = Math.floor(math/588);
                let mt = Math.floor((math-(ft*588))/28);
                let lt = Math.floor(math%28);
                if(math<0) ref.push(x);
                else ref.push([moduleHangul.f[ft],moduleHangul.m[mt],moduleHangul.l[lt]]);
            });
            return ref;
        }

        this.getConcat = function(data){
            let ref = [];
            data.forEach(x=>{
                let tmp = [];
                if(x[0] instanceof Array){
                    x.forEach(a=>{
                        let sf = moduleHangul.f.indexOf(a[0])*588;
                        let sm = moduleHangul.m.indexOf(a[1])*28;
                        let sl = moduleHangul.l.indexOf(a[2])%28;
                        if(a[1]=='' && a[2]==''){
                            tmp.push(moduleHangul.f[moduleHangul.f.indexOf(a[0])]);
                        } else {
                            tmp.push(String.fromCharCode(sf+sm+sl+44032)); // 7028
                        }
                    });
                } else {
                    if(x.length==1) tmp.push(x[0]);
                    else {
                        let sf = moduleHangul.f.indexOf(x[0])*588;
                        let sm = moduleHangul.m.indexOf(x[1])*28;
                        let sl = moduleHangul.l.indexOf(x[2])%28;
                        if(x[1]=='' && x[2]==''){
                            tmp.push(moduleHangul.f[moduleHangul.f.indexOf(x[0])]);
                        } else {
                            tmp.push(String.fromCharCode(sf+sm+sl+44032)); // 7028
                        }
                    }
                }
                ref.push(tmp);
            });
            return ref;
        }

        this.getTyping = function(data){
            let ref = [];
            data.forEach(x=>{
                if(!(x instanceof Array)){
                    ref = [...ref, [x]];
                } else {
                    let a=[x[0],'',''];
                    let b=[x[0],x[1],''];
                    let c=[x[0],x[1],x[2]];
                    if(x[2]!=''){
                        ref = [...ref, [a,b,c]];
                    } else {
                        ref = [...ref, [a,b]];
                    }
                }
            });
            return ref;
        }

        this.validTarget = function(){
            for(let typingItem of typingBundle){
                let target = typingItem.target;
                if(!target.dataset.langName) continue;
                if(target.dataset.langName.match(/[^rㄱ-힣\w\-]/gm)){
                    throw new Error('[NoTargetException] 지정한 타겟 중 특수문자가 포함되어 있습니다. 특수문자를 제외한 이름으로 지정해주세요.');
                }
            };
        }

        this.getTargetByName = function(name){
            return document.querySelector(`[data-lang-name="${name}"]`);
        }

        this.getTargetByOrder = function(order){
            let name = initOptions.typer.words[order].name;
            return this.getTargetByName(name);
        }
    }

    function View() {
        let uiElem = null;

        this.init = function (ui) {
            uiElem = ui;
        }

        this.doWriting = function(target, data, speed, callBack){
            let tmp='', repo='', i=0, q=0;
            let tps = setInterval(()=>{
                tmp = data[i][q];
                q++;
                target.innerHTML = repo+tmp;
                if(q>data[i].length-1){
                    q=0;
                    i++;
                    repo+=tmp;
                }
                if(i>data.length-1){
                    callBack();
                    clearInterval(tps);
                }
            },speed * 1000);
        }
    }

    return {
        init: function (options) {
            const body = document.body;
            const hangul = this.requireHangul();
            this.initializeOptions(options);
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
        initializeOptions: function(options){
            let initOptions = {
                typer: {
                    speed: 0.1,
                    delay: 1,
                    loop: false,
                    loopDelay: 1,
                }
            }

            function asyncOptions(init, obj){
                for (let op in obj) {
                    if(obj[op] instanceof Object && !(obj[op] instanceof Array) && op != 'words') {
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