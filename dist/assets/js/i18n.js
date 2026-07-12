(function(){
  "use strict";

  function reinitPage(){
    if(!window.TT) return;
    TT.initAll && TT.initAll();
    TT.initCarousels && TT.initCarousels();
    TT.initCalculators && TT.initCalculators();
    TT.initForms && TT.initForms();
  }

  function swapDocument(html, url){
    var parser = new DOMParser();
    var newDoc = parser.parseFromString(html, 'text/html');
    document.title = newDoc.title;
    var newLang = newDoc.documentElement.getAttribute('lang');
    if(newLang) document.documentElement.setAttribute('lang', newLang);

    var newDesc = newDoc.querySelector('meta[name="description"]');
    var curDesc = document.querySelector('meta[name="description"]');
    if(newDesc && curDesc) curDesc.setAttribute('content', newDesc.getAttribute('content') || '');

    ['canonical'].forEach(function(rel){
      var newLink = newDoc.querySelector('link[rel="' + rel + '"]');
      var curLink = document.querySelector('link[rel="' + rel + '"]');
      if(newLink && curLink) curLink.setAttribute('href', newLink.getAttribute('href') || '');
    });
    document.querySelectorAll('link[rel="alternate"]').forEach(function(el){ el.remove(); });
    newDoc.querySelectorAll('link[rel="alternate"]').forEach(function(el){ document.head.appendChild(el.cloneNode(true)); });

    document.body.className = newDoc.body.className;
    document.body.innerHTML = newDoc.body.innerHTML;
    window.scrollTo(0, 0);
    reinitPage();
  }

  function navigate(url, push){
    document.documentElement.setAttribute('data-tt-loading', 'true');
    fetch(url, {credentials: 'same-origin'}).then(function(r){
      if(!r.ok) throw new Error('network');
      return r.text();
    }).then(function(html){
      swapDocument(html, url);
      if(push) window.history.pushState({ttNav: true}, '', url);
    }).catch(function(){
      window.location.href = url;
    }).finally(function(){
      document.documentElement.removeAttribute('data-tt-loading');
    });
  }

  document.addEventListener('click', function(e){
    var link = e.target.closest('[data-lang-link]');
    if(!link) return;
    var href = link.getAttribute('href');
    if(!href || href.charAt(0) === '#') return;
    if(href === window.location.pathname) { e.preventDefault(); return; }
    e.preventDefault();
    navigate(href, true);
  });

  window.addEventListener('popstate', function(){
    navigate(window.location.pathname + window.location.search, false);
  });
})();
