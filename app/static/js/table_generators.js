function drawReport(data, id, datesLabels, metric, key_converter, links){
  var dates = Object.keys(data[Object.keys(data)[0]]).reverse();
  var header_row = $.map(dates, function(d, index){
    var tz_offset = new Date(d * 1000).getTimezoneOffset();
    var s = new Date((parseInt(d) + tz_offset*60) * 1000).toDateString();
    if (datesLabels[index]) s = datesLabels[index] + '<br>(<small>' + s + '</small>)';
    return '<th class="text-center">' + s + '</th>';
  });

  $(id).append('<tr><th> ' + metric + ' </th>' + header_row);

  // sort data in descending order of today's values
  data = _.map(data, function (val, key) {
    val.key = key_converter ? key_converter[key] : key;
    return val;
  })

  data = _.sortBy(data, function(d){ return d[dates[0]] ? -d[dates[0]].value : 0; })

  _.each(data, function(values){
    var row = $.map(dates, function(d){
      var row = '';
      var value;
      var diff;
      var growth;
      var suffix = '';

      if (values[d]) {
        value = values[d].value || 0;
        if (values.key.indexOf('rate') != -1 || metric.indexOf('rate') != -1)  {
          value = (value * 100).toFixed(1);
          suffix = '%'
        };

        growth = values[d].growth || 0;
        growth = growth > 0 ? '+' + Math.round(growth * 100) : Math.round(growth * 100);

        diff = values[d].diff || 0;
      } else {
        value = 'N/A';
        diff = 'N/A';
        growth = 'N/A';
      }

      if (diff > 0) row +='<td class="success text-center">';
      else if (diff < 0) row += '<td class="danger text-center">'
      else row += '<td class="text-center">';

      if (value == 'N/A') value = 0;
      return row + with_commas(value) + suffix + (growth != 0 && isFinite(growth) ? '<br/><small>('+growth+'%)</small></td>' : '</td>');
    });

    var fullname = values.key;
    if (values.key.indexOf('/') != -1) {
      var routename = values.key.split('/');
      values.key = routename[0].split(',')[0] + ' / ' + routename[1].split(',')[0];
    }
    var link = links ? 'link' : '';
    $(id).append('<tr><td class="' + link + '" data=' + fullname + '>' + values.key + '</td>' + row);
  });
}

function drawDimensionTable(container, data, dimension, percentage, total_index) {
  var metrics = Object.keys(data);
  var header_row = $.map(metrics, function(m, index){
    return '<th class="text-center">' + m +' </th>';
  });

  $(container).append('<thead><tr><th>' + dimension.toUpperCase() + ' </th>' + header_row + '</thead>');
  $(container).append('<tbody>');
  for (var dim in data[metrics[0]]) {
    var row = $.map(metrics, function(metric){
      var value = data[metric][dim] ? data[metric][dim].value : 0
      var suffix = '';
      if (metric.indexOf('rate') != -1)  {
        value = (value * 100).toFixed(1);
        suffix = '%'
      }
      if (percentage) value = Math.round(value * 100) + '%';
      return '<td data-value="' + value + '">' + with_commas(value) + suffix + '</td>';
    });
    $(container).append('<tr><td data="' + dim + '" class="link">' + dim + '</td>' + row + '</tr>');
  }
  $(container).append('</tbody>');
  $.bootstrapSortable(true);
}