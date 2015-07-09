function autocompleteInput(input_id, data, name, callback) {
  bloodhound = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: $.map(data, function(d) { return { value: d.name, type: d.type.toUpperCase() }; })
  });

  bloodhound.initialize();
 
  $(input_id).typeahead({
    hint: true,
    highlight: true,
    minLength: 1,
  },
  {
    name: name,
    displayKey: 'value',
    source: bloodhound.ttAdapter(),
    templates: {
      suggestion: Handlebars.compile('{{value}} <span class="option_tag">{{type}}</span>')
    }
  });

  if (callback) callback();
}

function monthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months = months - d1.getMonth() + d2.getMonth();
  return months <= 0 ? 0 : months;
}

function parseYYYY_MM_DD(str) {
  var y = str.substr(0,4),
      m = str.substr(5,2) - 1,
      d = str.substr(8,2);
  var D = new Date(y,m,d);
  return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? D : 'invalid date';
}

function with_commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getDateFromPicker(date_picker, days_ago) {
  var date = $(date_picker).val();
  var month;
  if (days_ago) {
    date = new Date(date);
    date = new Date(date - (days_ago * 3600 * 24 * 1000) + date.getTimezoneOffset() * 60000);
    month = date.getMonth();
    month = month >= 10 ? month + 1 : '0' + (month + 1);
    day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return [date.getFullYear(), month, day].join('-');
  }
  return date;
}

function getMetricToTitle() {
  return {
    num_tickets: 'Number of tickets',
    gross_revenues: 'Gross revenues',
    commissions: 'Commissions',
    num_routes: 'Purchased routes',
    num_visited_routes: 'Visited routes',
    num_visits: 'Number of visitors',
    purchases_per_visit: 'Conversion rate'
  }
}

function setDatePickerLogic(datepickers, start_input, end_input, zoompickers, button) {
  $(datepickers).datepicker({
    format: 'yyyy-mm-dd',
    weekStart: 1
  });

  $(zoompickers).click(function() {
    query.step = $(this).val();
    refreshCharts();
    updateDimensionData(true);
    if (query.step == 'week') {
      $(start_input).datepicker('setDaysOfWeekDisabled', [0,2,3,4,5,6]);
      $(end_input).datepicker('setDaysOfWeekDisabled', [1,2,3,4,5,6]);
    } else if (query.step == 'month') {
      $(datepickers).datepicker('remove');
      $(datepickers).datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        minViewMode: 1
      });
    } else {
      $(datepickers).datepicker('remove');
      $(datepickers).datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
      });
    }
  });

  $(datepickers).on('changeDate', function() {
    query.start_date = getDateFromPicker(start_input);
    query.end_date = getDateFromPicker(end_input);
    if (query.step == 'month') {
      var date = moment(query.end_date).add('months', 1).date(1).subtract('days', 1).format('YYYY-MM-DD');
      query.end_date = date;
      $(end_input).val(query.end_date);
    }
  });

  $(datepickers).on('hide', function() {
      $(end_input).val(query.end_date);
  });

  $(button).click(function() {
    query.start_date = getDateFromPicker(start_input);
    query.end_date = getDateFromPicker(end_input);
    refreshCharts();
    updateDimensionData();
    return false;
  });
}

function createInternalLinking(items_list) {
  $('table').on('click', 'tbody tr td:first-child', function() {
    var datatype;
    var value;
    if ($('#table-tabs div[aria-hidden=false]').length > 0) {
      datatype = $('#table-tabs div[aria-hidden=false]')[0].id.replace('tab-by_', '');
      value = $(this).html();
    } else if (items_list) {
      value = $(this).attr('data');
      datatype = _.findWhere(items_list, {name: value.split('/')[0]}).type;
    }

    if (['source', 'partner'].indexOf(datatype) > -1)
      document.location = '/partners/?source_name=' + $(this).html();
    else if (datatype == 'operator')
      document.location = '/operators/?operator_name=' + $(this).html();
    else if (datatype == 'country')
      document.location = '/countries/?country_name=' + $(this).html();
    else if (['route', 'city'].indexOf(datatype) > -1) {
      var routename = value.split('/');
      document.location = '/routes/?from=' + routename[0] + '&to=' + routename[1];
    }
  });
}