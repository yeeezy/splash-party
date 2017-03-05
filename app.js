var Nightmare = require('nightmare');
var _ = require('lodash');
var request = require('request');
var config = require('./config');
var uploadedSource = false;

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

Nightmare.action('keepTitle',
    function (name, options, parent, win, renderer, done) {
        parent.respondTo('keepTitle', function (done) {
            win.on('page-title-updated', function(event){event.preventDefault()});
            done();
        });
        done();
    },
    function (done) {
        this.child.call('keepTitle', done);
    });

function postPageSource(src) {
    request.post({
        url: 'https://snippets.glot.io/snippets',
        json: true,
        headers: {
            'Authorization': 'Token 14755b80-ec98-485d-9a95-156f28bf85b2'
        },
        body: {"language": "plaintext", "title": config.splashUrl, "public": true, "files": [{"name": "productpage.html", "content": src}]}
    })
}



var browserArr = new Array(config.partySize);

_.each(browserArr, function(browser, i) {
    browserArr[i] = Nightmare({
        show: false,
        alwaysOnTop: false,
        webPreferences: {
            partition: i
        }
    }).useragent(config.userAgent);
    setTimeout(function () {
        browserArr[i]
        .goto(config.splashUrl)
        .then(function() {
            party(browserArr[i], i);
        });
    }, 1000 * i);
});

function killSwitch(nm) {
    _.each(browserArr, function(browser) {
       if (browser !== nm) {
           browser.end();
       }
    });
}

function soleiusMartyrium(i) {
    var stripes = Nightmare({
        show: true,
        alwaysOnTop: false,
        title: Date(),
        webPreferences: {
            partition: i
        }
    });

    stripes.useragent(config.userAgent)
        .keepTitle()
        .goto(config.stripesUrl)
        .then(function() {
           console.log('///');
        }).catch(function(err) {
            console.log('error ', err );
        });

}

function party(nm, i) {
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
                        party(nm, i);
                    });
            } else {
                if (config.singleSuccess) {
                    killSwitch(nm);
                }
                return nm.html(`./page-source/${new Date().toString()}.html`, "HTMLComplete")
                    .then(function() {
                        return nm.cookies.get()
                    })
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
                    }).then(function() {
                        if (config.fuckNikeTalk) {
                            soleiusMartyrium(i);
                        }

                        if (!uploadedSource && config.enableSourceUpload) {
                            uploadedSource = true;
                            return nm.evaluate(function() {
                                return document.querySelector('html').outerHTML;
                            }).then(function(html) {
                                postPageSource(html);
                            });
                        }
                    });
            }
        })
        .catch(function (error) {
            console.error('an error has occurred: ' + error);
        });
}

