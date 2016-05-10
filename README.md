# Google Analytics for your Admin Panel
- Built using **Vanilla JS** and **Google Analytics API**.
- **active-users.js** from https://ga-dev-tools.appspot.com/embed-api (with a few modifications)

## Installation

Add the Google Analytics API:
```html
<!-- Google Analytics API -->
<script>
    (function(w,d,s,g,js,fjs){
    g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(cb){this.q.push(cb)}};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.src='https://apis.google.com/js/platform.js?onload=startApp';
    fjs.parentNode.insertBefore(js,fjs);js.onload=function(){g.load('analytics')};
    }(window,document,'script'));
</script>
```

Add the **active-users.js**:
```html
<!-- Plugin to show Active Users -->
<!-- Got from: https://ga-dev-tools.appspot.com/embed-api -->
<!-- With a few modifications... -->
<script src="active-users.js"></script>
```

Add your personal configs:
```html
<!-- My Perfonal Configs -->
<script>
    var client_id = "YOUR CLIENT_ID FROM GOOGLE ANALYTICS API!";

    var projects = [
      {name: "Project #1", ids: "ga:XXX"}, //fill with your ga:id
      {name: "Project #2", ids: "ga:XXX"},
      {name: "Project #3", ids: "ga:XXX"},
      // ...
    ];
</script>
```

And then add the **analytics.js**:
```html
<!-- Analytics Plugin -->
<script src="analytics.js"></script>
```

## Usage

Add the button to authorize your access on Google:
```html
<!-- Button to Authorize Access -->
<div id="auth-container"></div>
```

Where all your projects will be listed:
```html
<!-- List all projects -->
<div id="ga-projects"></div>
```

Listing the totals:
```html
<!-- The totals -->
<div id="ga-totals"></div>
```

The devices chart:
```html
<!-- Devices chart -->
<canvas id="ga-chart-devices" width="250" height="200"></canvas>
```

## Options

Inside your personal configs your can hide some totals data:
```html
<script>
    // ...
    var totalActive   = false; //default: true
    var totalSessions = false; //default: true
    var totalUnique   = false; //default: true
    var totalDevices  = false; //default: true
    // ...
</script>
```

Or you can change the chart colors:
```html
<script>
    // ...
    var chartColor  = ["#87CEFA", "#F08080"]; //mobile && desktop
    var textColor   = "#2F4F4F"; //text color
    // ...
</script>
```

## CSS

You can add some personal CSS like:
```css
.ga-sessions::before { content:"Sessions: "; }
.ga-unique::before { content:"Unique: "; }

.ga-project { float:left; width:25%; }
.ga-active { font-size:18px; }
.ga-percent { color:DarkGrey; }

/* For more, use your Element Inspector ;) */
```


## Example
![Analytics Example](http://i.imgur.com/o2up1oV.png)
