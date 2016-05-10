gapi.analytics.ready(function() {

  //authenticate on ga
  gapi.analytics.auth.authorize({
    container: 'auth-container',
    clientid: client_id,
  });


  //when the user is authenticated
  gapi.analytics.auth.on('success', function(response) {
    hide_logged_in();

    //list all projects
    for (i in projects) {
      var div = document.createElement('div');
      div.setAttribute('id', projects[i].ids.replace('ga:', ''));
      div.setAttribute('class', 'ga-project');
      document.getElementById("ga-projects").appendChild(div);

      var name = document.createElement('h3');
      name.setAttribute('class', 'ga-name');
      name.innerHTML = projects[i].name;
      div.appendChild(name);

      //get Report data from Google
      new gapi.analytics.report.Data({
        query: {
          ids: projects[i].ids,
          metrics: 'ga:sessions,ga:users',
          dimensions: 'ga:date',
          'start-date': '31daysAgo',
          'end-date': 'yesterday'
        }
      }).on('success', function(response) {
        var div = document.getElementById(response.profileInfo.profileId);
        active(div, response);
        sessions(div, response);
        unique(div, response);
        devices(div, response);
      }).execute();
    }

    //get the totals
    total_active();
    setInterval(function() {
      total_active();
    }, 3000);
  });


  //get total sessions
  function sessions(div, response) {
    var sessions = document.createElement('p');
    sessions.setAttribute('class', 'ga-sessions');
    div.appendChild(sessions);

    sessions.innerHTML = addDots(response.totalsForAllResults['ga:sessions']);

    total_sessions();
  }


  //get unique users
  function unique(div, response) {
    var unique = document.createElement('p');
    unique.setAttribute('class', 'ga-unique');
    div.appendChild(unique);

    unique.innerHTML = addDots(response.totalsForAllResults['ga:users']);

    total_unique();
  }


  //get users active now
  function active(div, response) {
    var active = document.createElement('p');
    active.setAttribute('class', 'ga-active');
    active.setAttribute('id', response.profileInfo.accountId);
    div.appendChild(active);

    new gapi.analytics.ext.ActiveUsers({
      container: response.profileInfo.accountId,
      pollingInterval: 5,
      ids: response.query.ids,
    }).execute();
  }


  //get the total for devices
  function devices(div, response) {
    var m = document.createElement('p');
    m.setAttribute('class', 'ga-mobile');
    div.appendChild(m);

    var d = document.createElement('p');
    d.setAttribute('class', 'ga-desktop');
    div.appendChild(d);

    //get Report Data from Google
    new gapi.analytics.report.Data({
      query: {
        ids: response.query.ids,
        metrics: 'ga:sessions',
        dimensions: 'ga:deviceCategory',
        'start-date': '31daysAgo',
        'end-date': 'yesterday'
      }
    }).on('success', function(response) {
      var desktop = typeof response.rows[0] !== "undefined" ? parseInt(response.rows[0][1]) : 0;
      var mobile  = typeof response.rows[1] !== "undefined" ? parseInt(response.rows[1][1]) : 0;
      var tablet  = typeof response.rows[2] !== "undefined" ? parseInt(response.rows[2][1]) : 0;

      mobile += tablet;

      var div = document.getElementById(response.profileInfo.profileId);

      //mobile values
      var m = div.getElementsByClassName('ga-mobile')[0];
      m.innerHTML = addDots(mobile);

      var percent_value = ' (' + ((mobile / response.totalsForAllResults['ga:sessions']) * 100).toFixed(1) + '%)';
      var percent = document.createElement('span');
      percent.setAttribute('class', 'ga-percent');
      percent.innerHTML = percent_value;
      m.appendChild(percent);

      //desktop values
      var d = div.getElementsByClassName('ga-desktop')[0];
      d.innerHTML = addDots(desktop);

      var percent_value = ' (' + ((desktop / response.totalsForAllResults['ga:sessions']) * 100).toFixed(1) + '%)';
      var percent = document.createElement('span');
      percent.setAttribute('class', 'ga-percent');
      percent.innerHTML = percent_value;
      d.appendChild(percent);

      total_devices();
    }).execute();
  }


  //get the actives
  function total_active() {
    var div = document.getElementById('ga-totals');

    if (div == null || (typeof totalActive !== "undefined" && totalActive === false)) {
      return false;
    }

    //active users
    var values_active = document.getElementsByClassName('ga-active');

    var total_active = 0;
    [].forEach.call(values_active, function(element) {
      var value_active = parseInt(element.innerHTML.replace('.', ''));
      total_active += value_active;
    });

    if (document.getElementsByClassName('ga-total-active').length == 0) {
      var active = document.createElement('p');
      active.setAttribute('class', 'ga-total-active');
      div.appendChild(active);
    }
    else {
      var active = document.getElementsByClassName('ga-total-active')[0];
    }
    active.innerHTML = addDots(total_active);
  }


  //get the totals
  function total_sessions() {
    var div = document.getElementById('ga-totals');

    if (div == null || (typeof totalSessions !== "undefined" && totalSessions === false)) {
      return false;
    }

    //sessions
    var values = document.getElementsByClassName('ga-sessions');

    var total = 0;
    [].forEach.call(values, function(el) {
      var value = parseInt(el.innerHTML.replace('.', ''));
      total += value;
    });

    if (document.getElementsByClassName('ga-total-sessions').length == 0) {
      var session = document.createElement('p');
      session.setAttribute('class', 'ga-total-sessions');
      div.appendChild(session);
    }
    else {
      var session = document.getElementsByClassName('ga-total-sessions')[0];
    }
    session.innerHTML = addDots(total);
  }


  //get the totals
  function total_unique() {
    var div = document.getElementById('ga-totals');

    if (div == null || (typeof totalUnique !== "undefined" && totalUnique === false)) {
      return false;
    }

    //unique users
    var values = document.getElementsByClassName('ga-unique');

    var total = 0;
    [].forEach.call(values, function(el) {
      var value = parseInt(el.innerHTML.replace('.', ''));
      total += value;
    });

    if (document.getElementsByClassName('ga-total-unique').length == 0) {
      var unique = document.createElement('p');
      unique.setAttribute('class', 'ga-total-unique');
      div.appendChild(unique);
    }
    else {
      var unique = document.getElementsByClassName('ga-total-unique')[0];
    }
    unique.innerHTML = addDots(total);
  }


  //get the totals
  function total_devices() {
    var div = document.getElementById('ga-totals');

    var enabled = true;
    if (div == null || (typeof totalDevices !== "undefined" && totalDevices === false)) {
      enabled = false;
    }

    //mobile
    var values = document.getElementsByClassName('ga-mobile');

    var mobile = 0;
    [].forEach.call(values, function(el) {
      var value = parseInt(el.innerHTML.replace('.', ''));
      mobile += value;
    });

    if (enabled) {
      if (document.getElementsByClassName('ga-total-mobile').length == 0) {
        var device = document.createElement('p');
        device.setAttribute('class', 'ga-total-mobile');
        div.appendChild(device);
      }
      else {
        var device = document.getElementsByClassName('ga-total-mobile')[0];
      }
      device.innerHTML = addDots(mobile);
    }

    //desktop
    var values = document.getElementsByClassName('ga-desktop');

    var desktop = 0;
    [].forEach.call(values, function(el) {
      var value = parseInt(el.innerHTML.replace('.', ''));
      desktop += value;
    });

    if (enabled) {
      if (document.getElementsByClassName('ga-total-desktop').length == 0) {
        var device = document.createElement('p');
        device.setAttribute('class', 'ga-total-desktop');
        div.appendChild(device);
      }
      else {
        var device = document.getElementsByClassName('ga-total-desktop')[0];
      }
      device.innerHTML = addDots(desktop);
    }


    //chart
    chart_devices(mobile, desktop);
  }


  //chart for devices
  function chart_devices(mobile, desktop) {
    var canvas = document.getElementById("ga-chart-devices");

    if (canvas == null) return false;

    var chartData = [mobile, desktop];
    var chartLabels = ["Mobile", "Desktop"];

    var chartPercent = [
      ((mobile / (mobile + desktop)) * 100).toFixed(1) + '%',
      ((desktop / (mobile + desktop)) * 100).toFixed(1) + '%',
    ];

    if (typeof chartColor === "undefined") {
      var chartColor = ["LightSkyBlue", "LightCoral"];
    }

    if (typeof textColor === "undefined") {
      var textColor = "DarkSlateGray";
    }

    create_chart(canvas, chartData, chartLabels, chartPercent, chartColor, textColor);
  }


  //create chart
  function create_chart(canvas, chartData, chartLabels, chartPercent, chartColor, textColor) {
    console.log(projects);

    var ctx;
    var lastend = 0;
    var chartTotal = 0;

    for (var j = 0; j < chartData.length; j++) {
      chartTotal += (typeof chartData[j] == 'number') ? chartData[j] : 0;
    }

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < chartData.length; i++) {
      ctx.fillStyle = chartColor[i];
      ctx.beginPath();
      ctx.moveTo(canvas.height / 2, canvas.height / 2);
      ctx.arc(canvas.height / 2, canvas.height / 2, canvas.height / 2, lastend, lastend + (Math.PI * 2 * (chartData[i] / chartTotal)), false);
      ctx.lineTo(canvas.height / 2, canvas.height / 2);
      ctx.fill();

      ctx.fillRect(canvas.width - 65, (18 * (i + 1)) - 9, 10, 10);
      ctx.font = 'bold 13px Arial';
      ctx.fillText(chartLabels[i], canvas.width - 50, 18 * (i + 1));

      var radius = (canvas.height / 2) / 2;
      var endAngle = lastend + (Math.PI * (chartData[i] / chartTotal));
      var setX = (canvas.height / 2) + Math.cos(endAngle) * radius;
      var setY = (canvas.height / 2) + Math.sin(endAngle) * radius;
      ctx.fillStyle = textColor;
      ctx.font = '13px Arial';
      ctx.fillText(chartPercent[i], setX, setY);

      lastend += Math.PI * 2 * (chartData[i] / chartTotal);
    }
  }


  //function to add dot to thousands
  function addDots(n){
    var rx=  /(\d+)(\d{3})/;
    return String(n).replace(/^\d+/, function(w){
        while(rx.test(w)){
            w= w.replace(rx, '$1.$2');
        }
        return w;
    });
  }


  //slugify
  function slug(Text) {
    return Text.toLowerCase().replace(/ /g,'').replace(/[^\w-]+/g,'');
  }


  //hide "You are logged in as..."
  function hide_logged_in() {
    document.getElementById("auth-container").style.display = 'none';
  }
});
