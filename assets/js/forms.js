window.TT = window.TT || {};

(function(){
  "use strict";

  function fieldLabel(input){
    var wrap = input.closest('.field') || input.closest('.field--full');
    var label = wrap ? wrap.querySelector('label') : null;
    return label ? label.textContent.trim() : (input.getAttribute('placeholder') || input.name || '');
  }

  function setupForm(form){
    if(form.__ttBound) return;
    form.__ttBound = true;

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var number = form.getAttribute('data-wa-number') || '';
      var title = form.getAttribute('data-wa-title') || '';
      var lines = [];
      if(title) lines.push(title);

      form.querySelectorAll('[data-field]').forEach(function(input){
        var val = (input.value || '').trim();
        if(val){
          lines.push(fieldLabel(input) + ': ' + val);
        }
      });

      var msg = lines.join('\n');
      var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener');

      var successEl = form.querySelector('[data-form-success]');
      if(successEl){
        successEl.hidden = false;
        clearTimeout(form.__ttSuccessTimer);
        form.__ttSuccessTimer = setTimeout(function(){ successEl.hidden = true; }, 7000);
      }
      form.reset();
    });
  }

  TT.initForms = function(){
    document.querySelectorAll('[data-wa-form]').forEach(setupForm);
  };

  document.addEventListener('DOMContentLoaded', TT.initForms);
})();
