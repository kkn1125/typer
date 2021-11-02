/**
 * Typing v0.2.1 (https://github.com/kkn1125/typer)
 * Copyright 2021 The Typer Authors kimson
 * Licensed under MIT (https://github.com/kkn1125/typer/blob/main/LICENSE)
 */
let codes = document.querySelectorAll('.code span');
codes.forEach(code => {
    code.innerHTML = highlighting(code.innerHTML.trim());
});

function highlighting(str) {
    let count = 0;
    let matchTag = str.replace(/[\s\S]*/gm, t=>{
        t = t.replace(/\<\w+\s?|\>|\<\/\w+\>/gm, tag=>{
            count++;
            tag = tag.split('').map(x=>x=='<'?x='&lt;':x=='>'?x='&gt;':x).join('');
            return `${count>1?'':''}<span class="typer-highlight-tag">${tag}</span>${count>1?'':''}`;
        });
        t = t.replace(/(typer\-exam)\=\"\"/gm, '');
        t = t.replace(/[\w\-]+\=\"[\w0-9\#\.\s]*?\"/gm, data=>{
            let split = data.split('=');
            let attr = `<span class="typer-highlight-attr">${split[0]}=</span>`;
            let quote = `<span class="typer-highlight-quote">${split[1]}</span>`;
            return attr+quote;
        });
        return t;
    });
    return matchTag;
}

window.addEventListener('load', titleHandler);
function titleHandler(){
    let target = [...document.querySelectorAll('[class^="h"]')];
    target = target.filter(x=>!x.classList.contains('brand'))
    target.map(tag=>{
        let link = document.createElement('a');
        link.innerHTML = '🔗';
        link.href = `#${tag.dataset.docsAnchor}`;
        link.classList.add('link');
        tag.append(link);
    });

    let ta = [...document.querySelectorAll('textarea')];
    ta.map(t=>{
        let copy = document.createElement('span');
        copy.innerHTML = 'copy';
        copy.classList.add('copy');
        t.insertAdjacentElement('afterend',copy);
        t.style.height = `${t.scrollHeight - 16}px`;
        copy.addEventListener('click',(ev)=>{
            let tg = ev.target.previousElementSibling;
            let tx = document.createElement('textarea');
            tx.innerHTML = tg.innerHTML.trim();
            document.body.append(tx);
            tx.select();
            document.execCommand('copy');
            tx.remove();
            copy.innerHTML = 'copy done! ✅';
            setTimeout(()=>{
                copy.innerHTML = 'copy';
            }, 3000);
        });
    });
}

window.addEventListener('click', anchorHandler);
function anchorHandler(ev){
    let target = ev.target;
    
    if(target.tagName !== 'A' || !target.getAttribute('href') || !target.getAttribute('href').match(/\#/gm)) return;
    ev.preventDefault();
    let href = target.getAttribute('href').slice(1);
    let anchor = document.querySelector(`[data-docs-anchor="${href}"]`);
    if(href=='') window.scrollTo(0, 0);
    else {
        let top = anchor.offsetTop;
        let navHeight = 56;
        window.scrollTo(0, top-navHeight);
    }
}

window.addEventListener('load', requestMarkdown);
function requestMarkdown(){
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', getUpdate.bind(xhr, parsingMd));
    xhr.open('get', location.pathname.split('/').filter(x=>!x.match('.html')).join('')+'/UPDATE.md');
    xhr.send();
}

function getUpdate(callback, ev){
    let target = ev.target;
    if(target.status == 200 || target.status == 201){
        if(target.readyState == 4){
            let parseArr = target.responseText.split(/\n/);
            callback(parseArr);
        }
    }
}

function parsingMd(arr){
    arr = arr.map(x=>x.replace(/[\r]/gm,''));
    
    arr = arr.map(x=>{
        let hash = x.match(/^[#]+/gm);
        if(hash) {
            hash = 6-parseInt(hash.map(x=>x.split('').length).join(''));
            return `<h${hash}>${x.replace(/[#]+/gm, '')}</h${hash}>`;
        }
        return `<p>${x}</p>`;
    });
    arr = arr.map(x=>{
        let len = x.match(/\-+/gm);
        if(len) {
            let line = len.map(x=>x.length);
            if(line>3)
            return `<hr>`;
            else return x;
        } else {
            return x;
        }
    });
    arr = arr.map(x=>{
        let tap = x.replace(/\<p\>\s/,'<p><span class=\'tab\'></span>');
        return tap;
    });

    arr = arr.join('\n');
    document.querySelector('#update').innerHTML += arr;
}

window.addEventListener('click', modalHandler);
function modalHandler(ev){
    let target = ev.target;
    let update = document.querySelector('#update');
    if(target.id !== 'update' && update.classList.contains('show')) {
        update.classList.remove('show');
        return;
    }
    if(target.tagName !== 'SPAN' || target.dataset.docsModal !== 'update') return;

    update.classList.toggle('show');
}