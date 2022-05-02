// Methods and jQuery UI for Wax search box
function excerptedString(str) {
  str = str || ''; // handle null > string
  if (str.length < 40) {
    return str;
  }
  else {
    return `${str.substring(0, 40)} ...`;
  }
}

function getThumbnail(item, url) {
  if ('thumbnail' in item) {
    return `<img class='sq-thumb-sm' src='${url}${item.thumbnail}'/>&nbsp;&nbsp;&nbsp;`
  }
  else {
    return '';
  }
  console.log("returned thumbnail")
}

function displayResult(item, fields, url) {
  console.log("display thumbnail")
  var transtitle = item.transtitle;
  var title = item.title || 'Untitled';
  var link  = item.permalink;
  var author = item.author;
  var translator = item.translator;
  var meta  = []


  for (i in fields) {
    fieldLabel = fields[i];
    if (fieldLabel in item ) {
      if (fieldLabel !== "title" && fieldLabel !== "poem" && fieldLabel !== "transpoem") {
      meta.push(`<br>${excerptedString(item[fieldLabel])}`);
      }
    }
  }
  return `<div class="result"><a href="${url}${link}"><p><b><span class="title">${item.title}</span></b><span class="meta">${meta.join('')}</span></p></a></div>`;
}

function startSearchUI(fields, indexFile, url) {
  $.getJSON(indexFile, function(store) {
    var index  = new elasticlunr.Index;

    index.saveDocument(false);
    index.setRef('lunr_id');
    console.log("started search UI")
    for (i in fields) { index.addField(fields[i]); }
    for (i in store)  { index.addDoc(store[i]); }

    $('input#search').on('keyup', function() {
      console.log("getting results")
      var results_div = $('#results');
      var query       = $(this).val();
      var results     = index.search(query, { boolean: 'AND', expand: true });

      results_div.empty();
      results_div.append(`<p class="results-info">Displaying ${results.length} results</p>`);

      for (var r in results) {
        var ref    = results[r].ref;
        var item   = store[ref];
        var result = displayResult(item, fields, url);

        results_div.append(result);
      }
    });
  });
}
