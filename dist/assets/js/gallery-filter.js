(function(){
  "use strict";

  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-filter-tabs] button');
    if(!btn) return;
    var group = btn.closest('[data-filter-tabs]');
    var groupId = group.getAttribute('data-filter-tabs');
    var target = btn.getAttribute('data-filter');

    group.querySelectorAll('button').forEach(function(b){
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });

    document.querySelectorAll('[data-filter-panel][data-filter-group="' + groupId + '"]').forEach(function(panel){
      panel.hidden = panel.getAttribute('data-filter-panel') !== target;
    });

    if(window.TT && TT.initCarousels) TT.initCarousels();
  });
})();
