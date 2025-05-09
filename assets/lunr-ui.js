---
layout: none
---
$(document).ready(function() {

  window.index = new elasticlunr.Index;

  index.saveDocument(true);
  index.setRef('lunr_index');
  index.addField('pid');
  index.addField('title');
  index.addField('transtitle');
  index.addField('author');
  index.addField('translator');
  index.addField('poem');
  index.addField('transpoem');
  index.addField('language');

  function constructCustomResult(item){
    var link = item.link;
    var label = '';
    var author = '';
    var meta = [];

    if (item.content) {
      label = item.title;
      author = item.author;
      meta.push(item.content.slice(0, 200).replace(/<(?:.|\n)*?>/gm, '').replace(/#|\*|_/gi) + '...');
    }

    

    return '<div class="result"><a href="' + link + '">' + '<div><span class="item-label">' + label + '</span><br>' + author + meta.join('&nbsp;&nbsp;') + '</div></a></div>';
  }


  $.getJSON("{{ site.baseurl }}/assets/lunr-index.json", function(store) {

    // add docs from json store to index
    for (i in store) {
      index.addDoc(store[i]);
    }

    $('input#search').on('keyup', function() {
      var results_div = $('#results');
      var query = $(this).val().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      var results = index.search(query, {
        boolean: 'AND',
        expand: true
      });
      results_div.empty();
      results_div.prepend("<p><small>Displaying " + results.length + " results.</small></p>");
      for (var r in results) {
        var ref = results[r].ref;
        var result = constructCustomResult(store[ref]);
        results_div.append(result);
      }
    });
  });
});
