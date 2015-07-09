function getDimensionRecap(query, callback) {
  $.get('/api/num_visits', query, function (vis) {
    $.get('/api/commissions', query, function (com) {
      $.get('/api/num_purchases', query, function (pur) {
        $.get('/api/purchases_per_visit', query, function (con) {
          var data = {
            'Number of visitors': JSON.parse(vis), 
            'Number of purchases': JSON.parse(pur),
            'Conversion rate': JSON.parse(con),
            'Commissions': JSON.parse(com)
          };
         if (callback) callback(data);
        });
      });
    });
  });
}

function getDimensionSalesRecap(query, callback) {
  $.get('/api/commissions', query, function (com) {
    $.get('/api/num_purchases', query, function (pur) {
      var purchases = JSON.parse(pur);
      var commissions = JSON.parse(com);
      var total_purchases = 0;
      var total_com = 0;
      var purchases_share = {};
      var com_share = {};
      var dimensions = Object.keys(purchases);
      
      for (dim in dimensions) { 
        total_purchases += purchases[dimensions[dim]].value;
        total_com += commissions[dimensions[dim]].value;
      }
      for (dim in dimensions) {
        purchases_share[dimensions[dim]] = {value: purchases[dimensions[dim]].value / total_purchases};
        com_share[dimensions[dim]] = {value: commissions[dimensions[dim]].value / total_com};
      }

      var data = {
        'Number of purchases': purchases,
        'Purchases share': purchases_share,
        'Commissions': commissions,
        'Commisssions share': com_share
      };
     if (callback) callback(data);
    });
  });
}