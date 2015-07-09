function drawMapContent(container, data, title) {
  var map_data = {'revenues': [], 'sellable': [], 'referrals': [], 'visitors': [], 'origin': []};
  $.getJSON( "/static/data/countries.json", function (countries) {
    for (var c in countries) {
      var code = countries[c].code;
      var name = countries[c].name;
      var alt_code = code;
      if (code == 'GB') alt_code = 'UK';
      for (var cat in map_data) {
        var new_value = 0;
        if (data[cat][code]) new_value = data[cat][code].value;
        map_data[cat].push({'code': alt_code, 'name': name, 'value': parseInt(new_value)});
      }
    }

    $(function () {
      Highcharts.Map({
        chart: {
          height: 500,
          renderTo: container.replace('#', ''),
        },
        title: {
          text: title
        },
        colorAxis: {
          min: 100,
          max: 20000,
        },
        tooltip: {
          formatter: function() {
            var value = {};
            var str = '<span style="font-weight:bold;font-size:15px;color:#3399FF">';
            str += this.point.name;
            str += '</span>';
            str += '<br/>';
            for (var i in this.series.chart.series) {
              str += '<span style="font-weight:bold">';
              str += with_commas(this.series.chart.series[i].points[this.point.x].value);
              str += '</span>';
              str += this.series.chart.series[i].tooltipOptions.valueSuffix + '<br/>';
            }
            return str;
          }
        },
        series: [{
          name: 'Revenues',
          data: map_data.revenues,
          mapData: Highcharts.maps.world,
          joinBy: 'code',
          tooltip: {
            valueSuffix: ' $ in commissions'
          }
        }, {
          name: 'Sellable routes',
          data: map_data.sellable,
          mapData: Highcharts.maps.world,
          joinBy: 'code',
          tooltip: {
            valueSuffix: ' sellable routes'
          }
        }, {
          name: 'Referral deal routes',
          data: map_data.referrals,
          mapData: Highcharts.maps.world,
          joinBy: 'code',
          tooltip: {
            valueSuffix: ' referral deal routes'
          }
        }, {
          name: 'Visitors origin',
          data: map_data.origin,
          mapData: Highcharts.maps.world,
          joinBy: 'code',
          tooltip: {
            valueSuffix: ' visitors from the country'
          }
        },{
          name: 'Visitors',
          data: map_data.visitors,
          mapData: Highcharts.maps.world,
          joinBy: 'code',
          tooltip: {
            valueSuffix: ' visiting the country'
          },
          point: {
            events: {
              click: function() {
                document.location = '/countries?country=' + this.code;
              }
            }
          }
        }]
      });
    });
  });
}

function drawDailyActivityChart(container, data, title, chart_type, percentage, chart_title, shared) {
  chart_type = chart_type || 'column';
  var suffix = '';
  var series = [];
  if (!(data instanceof Array)) data = [data];
  if (!(title instanceof Array)) title = [title];

  for (d in data) {
    var serie = {name: title[d]}
    if (percentage) suffix = '%';
    serie.data = _.map(data[d], function (val, key) {
      if (percentage) val.value = Math.round(val.value * 1000) / 10;
      return [parseInt(key) * 1000, val.value]; 
    });
    series.push(serie);
  }

  $(function () {
    $(container).highcharts({
      chart: {
        type: chart_type
      },
      title: {
        text: chart_title || title[0]
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        min: 0,
        title: {
          text: title
        },
        labels: {
          formatter: function() { return this.value + suffix;}
        }
      },
      tooltip: {
        valueSuffix: suffix,
        shared: shared
      },
      series: series
    });
  });
}

function drawComparativeActivityChart(container, data, title, days, callback) {
  var last_period = [];
  for (var d in data.last_period) {
    last_period.push([parseInt(d) * 1000 + (days * 24 * 3600 * 1000), data.last_period[d]['value']]);
  }
  var current_period = [];
  for (var d in data.current_period) {
    current_period.push([parseInt(d) * 1000, data.current_period[d]['value']]);
  }
  $(function () {
    $(container).highcharts({
      chart: {
        type: 'column',
      },
      title : {
        text: title
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {text: title},
        min: 0
      },
      series: [{
        name: 'Last period',
        data: last_period
      }, {
        name: 'Current period',
        data: current_period
      }]
    }, callback);
  });
}

function drawDailySharesChart(container, data, title) {
  var series = [];
  var dimension = Object.keys(data);
  for (var id_dim in dimension) {
    var new_serie = {name: dimension[id_dim]};
    new_serie.data = [];
    var timestamps = Object.keys(data[dimension[id_dim]])
    for (var id_ts in timestamps.sort()) {
      var value = data[dimension[id_dim]][timestamps[id_ts]].value
      if( value > 0) new_serie.data.push([timestamps[id_ts] * 1000, value]);
    }
    series.push(new_serie);
  }

  $(function () {
    $(container).highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: title
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        min: 0,
        title: {
            text: title
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        column: {
            stacking: 'percent'
        }
      },
      series: series
    });
  });
}

function drawTwoStackedBarTimeChart(container, under, above, merged, title_under, title_above, title, show_total) {
  var series = [];
  for (var d in [0, 1]) {
    var data = [above, under][d];
    var data_title = [title_above, title_under][d];
    var serie = {name: data_title, data: []};
    var timestamps = Object.keys(data);
    for (var ix in timestamps) {
      var value = data[timestamps[ix]].value;
      if (merged && data == above && under[timestamps[ix]]) value -= under[timestamps[ix]].value;
      serie.data.push([timestamps[ix] * 1000, value]);
    }
    series.push(serie);
  }

  $(container).highcharts({
    chart: {
      type: 'column'
    },
    title: {
      text: title
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      min: 0,
      title: {
        text: title_under + ' / ' + title_above
      }
    },
    tooltip: {
      shared:true,
      formatter: function() {
        var s = '<b>'+ moment.utc(this.x / 1000, 'X').format('ddd DD MMM YYYY') +'</b>';
        $.each(this.points, function(i, point) {
          var value = point.y;
          if (point.series.name == title_above) value = point.total;
          s += '<br/><span style="color:' + point.series.color + '">'+ point.series.name +': '+
            '</span>' + with_commas(value);
          if (point.series.name == title_under) s += ' (' + point.percentage.toFixed(2) + '%)';
          if (show_total) s += '<br/><span>' + point.total + '</span>';
        });
        return s;
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        events: {
          legendItemClick: function (e) {
            if(e.target.name == title_under) e.preventDefault();
          }
        }
      }
    },
    series: series
  });
}

function drawStackedChart(container, data, metrics, title) {
  var series = [];
  for (var m in metrics) {
    var serie = {name: metrics[m], data: []};
    var timestamps = Object.keys(data[metrics[m]]);
    for (ix in timestamps) {
      var value = data[metrics[m]][timestamps[ix]].value;
      if (parseInt(m) < metrics.length - 1 && data[metrics[parseInt(m)+1]][timestamps[ix]])
        value -= data[metrics[parseInt(m)+1]][timestamps[ix]].value;
      serie.data.push([timestamps[ix] * 1000, value]);
    }
    series.push(serie);
  }

  $(container).highcharts({
    chart: {
      type: 'column'
    },
    title: {
      text: title
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      min: 0
    },
    tooltip: {
      shared:true
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    series: series
  });
}

function highchartsLoader() {
  for (var i = 0; i < arguments.length; i++) {
    $(arguments[i]).html("<img class='loading-img' src='/static/img/loading.png'>");
  }
}