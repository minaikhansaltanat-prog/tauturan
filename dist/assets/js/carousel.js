window.TT = window.TT || {};

(function(){
  "use strict";

  function debounce(fn, wait){
    var t;
    return function(){
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function(){ fn.apply(ctx, args); }, wait);
    };
  }

  function setupCarousel(root){
    if(root.__ttBound) return;
    root.__ttBound = true;

    var viewport = root.querySelector('[data-viewport]');
    var track = root.querySelector('[data-track]');
    var prevBtn = root.querySelector('[data-prev]');
    var nextBtn = root.querySelector('[data-next]');
    if(!viewport || !track) return;

    var originals = Array.prototype.slice.call(track.children);
    if(originals.length < 2) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var autoplay = root.getAttribute('data-autoplay') !== 'false' && !reduceMotion;
    var interval = parseInt(root.getAttribute('data-interval'), 10) || 4200;

    function cloneList(list, prepend){
      var frag = document.createDocumentFragment();
      list.forEach(function(node){
        var c = node.cloneNode(true);
        c.setAttribute('aria-hidden','true');
        c.querySelectorAll('[id]').forEach(function(n){ n.removeAttribute('id'); });
        frag.appendChild(c);
      });
      if(prepend){ track.insertBefore(frag, track.firstChild); }
      else { track.appendChild(frag); }
    }
    cloneList(originals, false);
    cloneList(originals.slice().reverse(), true);

    var setWidth = 0;
    function measure(){
      setWidth = 0;
      for(var i=0;i<originals.length;i++){
        var el = track.children[originals.length + i];
        setWidth += el.getBoundingClientRect().width + parseFloat(getComputedStyle(el).marginRight || 0);
      }
      return setWidth;
    }

    function stepWidth(){
      var first = track.children[originals.length];
      return first.getBoundingClientRect().width + parseFloat(getComputedStyle(first).marginRight || 0);
    }

    measure();
    viewport.scrollLeft = setWidth;

    window.addEventListener('resize', debounce(function(){
      var ratioStep = viewport.scrollLeft / (setWidth || 1);
      measure();
      viewport.scrollLeft = setWidth * ratioStep;
    }, 200));

    var settleTimer;
    viewport.addEventListener('scroll', function(){
      clearTimeout(settleTimer);
      settleTimer = setTimeout(function(){
        if(!setWidth) return;
        if(viewport.scrollLeft < setWidth * 0.5){
          viewport.style.scrollBehavior = 'auto';
          viewport.scrollLeft += setWidth;
          requestAnimationFrame(function(){ viewport.style.scrollBehavior = ''; });
        } else if(viewport.scrollLeft > setWidth * 1.5){
          viewport.style.scrollBehavior = 'auto';
          viewport.scrollLeft -= setWidth;
          requestAnimationFrame(function(){ viewport.style.scrollBehavior = ''; });
        }
      }, 120);
    }, {passive:true});

    function goNext(){ viewport.scrollBy({left: stepWidth(), behavior:'smooth'}); }
    function goPrev(){ viewport.scrollBy({left: -stepWidth(), behavior:'smooth'}); }

    if(nextBtn) nextBtn.addEventListener('click', function(){ goNext(); restartAutoplay(); });
    if(prevBtn) prevBtn.addEventListener('click', function(){ goPrev(); restartAutoplay(); });

    var timer = null;
    function startAutoplay(){
      if(!autoplay) return;
      stopAutoplay();
      timer = setInterval(goNext, interval);
    }
    function stopAutoplay(){ if(timer){ clearInterval(timer); timer = null; } }
    function restartAutoplay(){ if(autoplay){ startAutoplay(); } }

    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('touchstart', stopAutoplay, {passive:true});
    root.addEventListener('touchend', function(){
      clearTimeout(root._resumeT);
      root._resumeT = setTimeout(startAutoplay, 2600);
    }, {passive:true});
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', startAutoplay);

    if(!document.__ttVisBound){
      document.__ttVisBound = true;
      document.addEventListener('visibilitychange', function(){
        document.querySelectorAll('[data-carousel]').forEach(function(r){
          if(document.hidden){ if(r.__ttStop) r.__ttStop(); }
          else { if(r.__ttStart) r.__ttStart(); }
        });
      });
    }
    root.__ttStop = stopAutoplay;
    root.__ttStart = startAutoplay;

    startAutoplay();
  }

  TT.initCarousels = function(){
    document.querySelectorAll('[data-carousel]').forEach(setupCarousel);
  };

  document.addEventListener('DOMContentLoaded', TT.initCarousels);
})();
