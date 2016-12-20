var Timer;
var TotalSeconds;
var Wasters_1;
var FontSize;
$(document).ready(function () {
    var lastSession = Cookies.get('last_session');
    var totalSeconds = 0;
    var wasters = 1;
    var fontSize = 14;
    if (!$.isEmptyObject(lastSession)) {
        lastSession = JSON.parse(lastSession);
        totalSeconds = parseInt(lastSession.total_seconds);
        if (totalSeconds == 'NaN') {
            totalSeconds = 0
        }
        wasters = parseInt(lastSession.wasters);
        if (wasters == 'NaN') {
            wasters = 1
        }
        fontSize = parseInt(lastSession.font_size);
        if (fontSize == 'NaN') {
            fontSize = 14
        }
    }
    CreateTimer("timer", totalSeconds, wasters, fontSize);
});

function CreateTimer(TimerID, Time, Wasters, fontSize) {
    Timer = $('#' + TimerID + '');
    TotalSeconds = Time;
    FontSize = fontSize;
    $('#wastersCount').css('font-size', FontSize + 'px');
    $('#wastersCount').text(Wasters);
    Wasters_1 = Wasters;
    UpdateTimer();
    setTimeout(function () {
        Tick()
    }, 1000);
}

function watersAdd() {
    var wastersCount = $('#wastersCount');
    var wasters = parseInt(wastersCount.text());
    wasters += 1;
    wastersCount.text(wasters);
    if (FontSize < 80) {
        FontSize += 1;
    }
    updateTick();
}

function wastersRemove() {
    var wastersCount = $('#wastersCount');
    var wasters = parseInt(wastersCount.text());
    if (wasters > 1) {
        wasters -= 1;
        wastersCount.text(wasters);
    }
    if (FontSize > 16) {
        FontSize -= 1;
    }
    updateTick();
}

function updateTick() {
    Wasters_1 = parseInt($('#wastersCount').text());
    $('#wastersCount').css('font-size', FontSize + 'px');
    updateLastSession();
}

function Tick() {
    TotalSeconds += Wasters_1;
    UpdateTimer();
    setTimeout(function () {
        Tick();
    }, 1000);
}

function UpdateTimer() {
    var hours = parseInt(TotalSeconds / 3600) % 24;
    var minutes = parseInt(TotalSeconds / 60) % 60;
    var seconds = TotalSeconds % 60;
    var result = (hours < 10 ? "0" + hours : hours) + " : " + (minutes < 10 ? "0" + minutes : minutes) + " : " + (seconds < 10 ? "0" + seconds : seconds) + " sec";
    updateLastSession();
    Timer.text(result);
}

function wastersReset() {
    TotalSeconds = 0;
    Wasters_1 = 1;
    $('#wastersCount').text(Wasters_1);
    FontSize = 14;
    updateTick();
    UpdateTimer();
}

function updateLastSession() {
    var fontSize = parseInt($('#wastersCount').css('font-size'));
    var lastSesstion = {
        'total_seconds': TotalSeconds
        , 'wasters': Wasters_1
        , 'font_size': FontSize
    }
    Cookies.set('last_session', lastSesstion);
}

function updateWasterName(response) {
    var token = response.authResponse.accessToken;
    var userID = response.authResponse.userID;
    $.getJSON('https://graph.facebook.com/me?access_token=' + token, function (data) {
        var id = data.id;
        var name = data.name;
        $('#waster').text(name);
    });
}

function getStatus() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            console.log('Logged in.');
            updateWasterName(response);
        }
    });
}

function facebookLogin() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            console.log('Logged in.');
            updateWasterName(response);
        }
        else {
            FB.login(function (response) {
                if (response.status === 'connected') {
                    updateWasterName(response);
                }
                else if (response.status === 'not_authorized') {
                    console.log('not_authorized');
                }
                else {
                    console.log('unknown');
                }
            }, {
                scope: 'public_profile,email'
            });
        }
    });
}

function initFacebook() {
    window.fbAsyncInit = function () {
        FB.init({
            appId: '721208764722489'
                //                    appId: '721252094718156'
                
            , xfbml: true
            , version: 'v2.8'
        });
        FB.AppEvents.logPageView();
        getStatus();
    };
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}