window.TT = window.TT || {};

(function(){
  "use strict";

  function initMobileNav(){
    var burger = document.querySelector('[data-burger]');
    var nav = document.querySelector('[data-mobile-nav]');
    if(!burger || !nav) return;
    var closeBtn = nav.querySelector('[data-mobile-close]');
    var scrim = nav.querySelector('[data-mobile-scrim]');

    function open(){
      nav.setAttribute('data-open','true');
      burger.setAttribute('aria-expanded','true');
      document.documentElement.style.overflow = 'hidden';
      var firstLink = nav.querySelector('a,button');
      if(firstLink) firstLink.focus({preventScroll:true});
    }
    function close(){
      nav.setAttribute('data-open','false');
      burger.setAttribute('aria-expanded','false');
      document.documentElement.style.overflow = '';
      burger.focus({preventScroll:true});
    }
    burger.addEventListener('click', function(){
      var expanded = burger.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });
    if(closeBtn) closeBtn.addEventListener('click', close);
    if(scrim) scrim.addEventListener('click', close);
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', close);
    });

    if(!document.__ttEscBound){
      document.__ttEscBound = true;
      document.addEventListener('keydown', function(e){
        if(e.key !== 'Escape') return;
        var n = document.querySelector('[data-mobile-nav][data-open="true"]');
        if(!n) return;
        var b = document.querySelector('[data-burger]');
        n.setAttribute('data-open','false');
        if(b) b.setAttribute('aria-expanded','false');
        document.documentElement.style.overflow = '';
      });
    }
  }

  var revealObserver = null;
  function initReveal(){
    if(revealObserver) revealObserver.disconnect();
    var items = document.querySelectorAll('.reveal');
    if(!items.length) return;
    if(!('IntersectionObserver' in window)){
      items.forEach(function(el){ el.classList.add('is-visible'); });
      return;
    }
    revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:.14, rootMargin:'0px 0px -40px 0px'});
    items.forEach(function(el){ revealObserver.observe(el); });
  }

  function initAudioPlayers(){
    document.querySelectorAll('[data-audio-player]').forEach(function(wrap){
      if(wrap.__ttBound) return;
      wrap.__ttBound = true;
      var audio = wrap.querySelector('audio');
      var btn = wrap.querySelector('[data-audio-toggle]');
      var bar = wrap.querySelector('[data-audio-bar]');
      var fill = wrap.querySelector('[data-audio-fill]');
      var time = wrap.querySelector('[data-audio-time]');
      if(!audio || !btn) return;
      var playIcon = btn.querySelector('[data-icon-play]');
      var pauseIcon = btn.querySelector('[data-icon-pause]');

      function fmt(s){
        if(!isFinite(s)) return '0:00';
        var m = Math.floor(s/60), sec = Math.floor(s%60);
        return m + ':' + (sec < 10 ? '0'+sec : sec);
      }
      btn.addEventListener('click', function(){
        document.querySelectorAll('[data-audio-player] audio').forEach(function(a){
          if(a !== audio && !a.paused){ a.pause(); }
        });
        if(audio.paused){ audio.play(); } else { audio.pause(); }
      });
      audio.addEventListener('play', function(){
        if(playIcon) playIcon.style.display = 'none';
        if(pauseIcon) pauseIcon.style.display = '';
      });
      audio.addEventListener('pause', function(){
        if(playIcon) playIcon.style.display = '';
        if(pauseIcon) pauseIcon.style.display = 'none';
      });
      audio.addEventListener('timeupdate', function(){
        var pct = audio.duration ? (audio.currentTime/audio.duration*100) : 0;
        if(fill) fill.style.width = pct + '%';
        if(time) time.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration || 0);
      });
      audio.addEventListener('loadedmetadata', function(){
        if(time) time.textContent = '0:00 / ' + fmt(audio.duration);
      });
      audio.addEventListener('ended', function(){
        if(fill) fill.style.width = '0%';
      });
      if(bar){
        bar.addEventListener('click', function(e){
          var rect = bar.getBoundingClientRect();
          var ratio = (e.clientX - rect.left) / rect.width;
          if(audio.duration) audio.currentTime = ratio * audio.duration;
        });
      }
    });
  }

  function initVideoTestimonials(){
    document.querySelectorAll('[data-video-testi]').forEach(function(card){
      if(card.__ttBound) return;
      card.__ttBound = true;
      var videoUrl = card.getAttribute('data-video-src');
      card.addEventListener('click', function(){
        if(!videoUrl || card.querySelector('video')) return;
        var video = document.createElement('video');
        video.src = videoUrl;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        card.innerHTML = '';
        card.appendChild(video);
      });
    });
  }

  TT.initAll = function(){
    initMobileNav();
    initReveal();
    initAudioPlayers();
    initVideoTestimonials();
  };

  document.addEventListener('DOMContentLoaded', TT.initAll);
})();
