(function ($) {

  alert('v6: Ready to export.\n'
    + 'This includes loading all your haves which may take some time.\n'
    + 'A download button will appear in the top left corner of the screen when done.');

  var conditionMap = {
    'NM/M': 'Near Mint',
    'SP': 'Slightly Played',
    'MP': 'Moderately Played',
    'HP': 'Heavily Played'
  };

  var tradableMap = {
    true: 'HAVE',
    false: 'NOT FOR TRADE',
  };

  var quote = function (s) {
    return '"' + s + '"';
  };

  var cards = [];

  var collectCards = function () {
    var $cards = $('.item.clear');
    for (var i = 0; i < $cards.length; i++) {
      var $card = $($cards[i]);

      var card = {
        cardName: $card.find('a[data-card_id]').text(),
		//cardName: "ph",
        isFoil: $card.find('.foil').text(),
		//isFoil: "ph",
        language: "English",
		//language: "EN",
        condition: "Near Mint",
		//condition: "NM",
		//pucaID: $card.find('a[data-card_id]').attr("href")
		pucaID: $card.find('a[data-card_id]').attr("href")
      };

      if (card.cardName) {
        cards.push(card);
      }

    }
    $cards.remove();
  };

  var doExport = function () {
    console.log('exporting');

    var groups = _.groupBy(cards, function (c) { return JSON.stringify(c); });

    var csv = [['Count', 'Name', 'Condition', 'Language', 'Foil', 'PucaID'].join(',') + '\n'];
    for (var key in groups) {
      var group = groups[key];
      var card = group[0];
      var quantity = group.length;
      group.length = 0; // a bit of cleanup
      var row = [quantity, quote(card.cardName), card.condition, card.language, card.isFoil, card.pucaID];
      csv.push(row.join(',') + '\n');
    }

    var blob = new Blob(csv, { type: 'text/csv' });

    $('<a/>', {
      href: URL.createObjectURL(blob),
      class: 'btn',
      download: 'Pucatrade Promos ' + (new Date()) + '.csv'
    }).css({
      position: 'fixed',
      left: '20px',
      top: '20px',
      'z-index': 100
    }).text('Download .CSV').appendTo($('body'));

  };

  var loadOrExport = function () {
    
    var $more = $("a:contains('LOAD MORE')");
    if ($more.length == 1) {
      // no more load button
	  collectCards();
      doExport();
      return;
    }
    
    console.log('expanding page');
    var evt = new Event("click", { "bubbles": true, "cancelable": true });
    $more[1].dispatchEvent(evt);

    setTimeout(loadOrExport, 10000);
  };

  loadOrExport();


})($);
