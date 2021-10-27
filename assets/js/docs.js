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