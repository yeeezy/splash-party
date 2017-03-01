var Nightmare = require('nightmare');
var _ = require('lodash');
var config = require('./config');

Nightmare.action('show',
    function (name, options, parent, win, renderer, done) {
        parent.respondTo('show', function (done) {
            win.show();
            done();
        });
        done();
    },
    function (done) {
        this.child.call('show', done);
    });

Nightmare.action('hide',
    function (name, options, parent, win, renderer, done) {
        parent.respondTo('hide', function (done) {
            win.hide();
            done();
        });
        done();
    },
    function (done) {
        this.child.call('hide', done);
    });


Nightmare.action('clearCache',
    function (name, options, parent, win, renderer, done) {
        parent.respondTo('clearCache', function (done) {
            win.webContents.session.clearCache(done);
            done();

        });
        done();
    },
    function (done) {
        this.child.call('clearCache', done);
    });


Nightmare.action('printUserAgent',
    function (name, options, parent, win, renderer, done) {
        parent.respondTo('printUserAgent', function (done) {
            done(null, win.webContents.getUserAgent());
        });
        done();
    },
    function (done) {
        this.child.call('printUserAgent', done);
    });

var browserArr = new Array(config.partySize);

_.each(browserArr, function(browser, i) {
    browserArr[i] = Nightmare({
        show: false,
        webPreferences: {
        partition: i,
        alwaysOnTop: false
        }
    }).useragent(config.userAgent);
    setTimeout(function () {
        browserArr[i],
        .goto(config.splashUrl)
        .then(function() {
            party(browser);
        });
    }, 1000 * i);
});

function party(nm) {
    nm.exists(config.splashUniqueIdentifier)
        .then(function (isSplash) {
            if (isSplash) {
                return nm
                    .wait(config.waitTime)
                    .then(function () {
                        return nm.cookies.clearAll()
                    })
                    .then(function () {
                        return nm.clearCache()
                    })
                    .then(function () {
                        return nm.refresh();
                    })
                    .then(function () {
                        party(nm);
                    });
            } else {
                return nm.cookies.get()
                    .then(function (cookies) {
                        _.each(cookies, function (cookie) {
                            console.log("document.cookie='" + cookie.name + "=" + cookie.value + "';");
                        });
                    })
                    .then(function () {
                        return nm.printUserAgent();
                    })
                    .then(function (ua) {
                        console.log(ua);
                    }).then(function () {
                        return nm.show();
                    });
            }
        })
        .catch(function (error) {
            console.error('an error has occurred: ' + error);
        });
}

