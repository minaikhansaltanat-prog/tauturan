window.TT = window.TT || {};

(function(){
  "use strict";

  function fieldLabel(input){
    var wrap = input.closest('.field');
    var label = wrap ? wrap.querySelector('label') : null;
    return label ? label.textContent.trim() : '';
  }

  function formatMoney(n){
    return Math.round(n).toLocaleString('ru-RU') + ' ₸';
  }

  function computeCalculator(root){
    var typeSelect = root.querySelector('[data-field="type"]');
    var seasonSelect = root.querySelector('[data-field="season"]');
    var nightsInput = root.querySelector('[data-field="nights"]');
    var guestsInput = root.querySelector('[data-field="guests"]');
    var resultPrice = root.querySelector('[data-result-price]');
    var waBtn = root.querySelector('[data-wa-send]');
    if(!typeSelect || !seasonSelect || !nightsInput) return;

    var opt = typeSelect.options[typeSelect.selectedIndex];
    var season = seasonSelect.value;
    var price = parseFloat(opt.getAttribute('data-' + season)) || 0;
    var nights = Math.max(1, parseInt(nightsInput.value, 10) || 1);
    var guests = guestsInput ? Math.max(1, parseInt(guestsInput.value, 10) || 1) : null;
    var total = price * nights;

    if(resultPrice) resultPrice.textContent = formatMoney(total);

    if(waBtn){
      var number = root.getAttribute('data-wa-number') || '';
      var lines = [];
      var introTpl = root.getAttribute('data-msg-intro');
      if(introTpl) lines.push(introTpl);
      lines.push(fieldLabel(typeSelect) + ': ' + opt.textContent.trim());
      lines.push(fieldLabel(seasonSelect) + ': ' + seasonSelect.options[seasonSelect.selectedIndex].textContent.trim());
      lines.push(fieldLabel(nightsInput) + ': ' + nights);
      if(guestsInput) lines.push(fieldLabel(guestsInput) + ': ' + guests);
      var totalLabel = root.getAttribute('data-msg-total') || 'Total';
      lines.push(totalLabel + ': ' + formatMoney(total));
      waBtn.setAttribute('href', 'https://wa.me/' + number + '?text=' + encodeURIComponent(lines.join('\n')));
    }
  }

  function setupCalculator(root){
    if(root.__ttBound) return;
    root.__ttBound = true;
    root.querySelectorAll('[data-field]').forEach(function(field){
      field.addEventListener('input', function(){ computeCalculator(root); });
      field.addEventListener('change', function(){ computeCalculator(root); });
    });
    computeCalculator(root);
  }

  TT.initCalculators = function(){
    document.querySelectorAll('[data-calculator]').forEach(setupCalculator);
  };

  document.addEventListener('DOMContentLoaded', TT.initCalculators);
})();
