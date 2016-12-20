var Timer;
var TotalSeconds;
var WastersCount;
var FontSize;

function wastersAdd() {
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
    WastersCount = parseInt($('#wastersCount').text());
    $('#wastersCount').css('font-size', FontSize + 'px');
    updateLastSession();
}

function Tick() {
    TotalSeconds += WastersCount;
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
    WastersCount = 1;
    $('#wastersCount').text(WastersCount);
    FontSize = 14;
    updateTick();
    UpdateTimer();
}

function updateLastSession() {
    var lastSesstion = {
        'total_seconds': TotalSeconds
        , 'wasters': WastersCount
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

function CreateTimer(Time, Wasters, fontSize) {
    Timer = $('#timer');
    TotalSeconds = Time;
    FontSize = fontSize;
    $('#wastersCount').css('font-size', FontSize + 'px');
    $('#wastersCount').text(Wasters);
    WastersCount = Wasters;
    new UpdateTimer();
    requestIdleCallback(Tick, {
        timeout: 1000
    });
    //    setTimeout(function () {
    //        Tick()
    //    }, 1000);
}
$(document).ready(function () {
    var lastSession = Cookies.get('last_session')
        , totalSeconds, wasters, fontSize;
    totalSeconds = 0;
    wasters = 1;
    fontSize = 14;
    if (!$.isEmptyObject(lastSession)) {
        lastSession = JSON.parse(lastSession);
        totalSeconds = parseInt(lastSession.total_seconds);
        if (isNaN(totalSeconds)) {
            totalSeconds = 0;
        }
        wasters = parseInt(lastSession.wasters);
        if (isNaN(wasters)) {
            wasters = 1;
        }
        fontSize = parseInt(lastSession.font_size);
        if (isNaN(fontSize)) {
            fontSize = 14;
        }
    }
    CreateTimer(totalSeconds, wasters, fontSize);
});