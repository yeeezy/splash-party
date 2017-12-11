var Nightmare = require('nightmare');
var _ = require('lodash');
var request = require('request');
var config = require('./config');
var chalk = require('chalk');
var wait = require('nightmare-wait-for-url');
var util = require('util');

var uploadedSource = false;

var cookieArr = new Array(config.partySize);


function cookieTransform(cookies) {
    var updated = [];
    _.each(cookies, function (cookie) {
        var url = '';
        if (cookie.secure) {
            url += 'https://';
        } else {
            url += 'http://';
        }

        if (cookie.domain.startsWith('.')) {
            url += 'www';
        }

        url += cookie.domain;

        updated.push(_.assign({url: url}, _.omit(cookie, 'domain')))
    });

    return updated;
}

function getStripesUrl() {
    var stripes = config.stripesUrl,
        portIndex = stripes.indexOf(':', stripes.indexOf(':') + 1);

    if (portIndex > -1) {
        return stripes.substring(0, portIndex)
    } else {
        return stripes.substring(0, stripes.indexOf('/', stripes.indexOf('//') + 1));
    }
}

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
            win.on('page-title-updated', function (event) {
                event.preventDefault()
            });
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
            'Authorization': 'Token d94a031a-d97a-4276-887e-ed4894875579'
        },
        body: {
            "language": "plaintext",
            "title": config.splashUrl,
            "public": true,
            "files": [{"name": "productpage.html", "content": src}]
        }
    })
}


var browserArr = new Array(config.partySize);

var stripesCookieDomain = getStripesUrl();

_.each(browserArr, function (browser, i) {
    browserArr[i] = Nightmare({
        show: false,
        alwaysOnTop: false,
        webPreferences: {
            partition: i
        }
    }).useragent(config.userAgent)
        .cookies.clearAll()
        .clearCache()
        .cookies.set(cookieTransform(config.gCookies));

    setTimeout(function () {
        browserArr[i]
            .goto(config.splashUrl)
            .then(function () {
                party(browserArr[i], i);
            }).catch(function (error) {
            console.error('an error has occurred: ' + error);
            console.error(util.inspect(error));
            browserArr[i].end();
        });
    }, 1000 * i);
});

function killSwitch(nm) {
    _.each(browserArr, function (browser) {
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
        waitTimeout: 120000,
        webPreferences: {
            partition: i
        }
    }).useragent(config.userAgent)
        .keepTitle()
        .cookies.set(cookieArr[i]);

    if (config.fuckGmail) {
        stripes
            .goto('https://www.gmail.com')
            .waitForUrl('(https://mail.google.com\/mail/).*(inbox)')
            .goto(config.stripesUrl)
            .then(function () {
                console.log('///');
            }).catch(function (err) {
            console.log('error ', err);
            console.error(util.inspect(error));
        });
    } else {
        stripes
            .goto(config.stripesUrl)
            .then(function () {
                console.log('///');
            }).catch(function (err) {
            console.log('error ', err);
            console.error(util.inspect(error));
        });
    }
}

function party(nm, i) {
    nm.evaluate(function() {
        return typeof CAPTCHA_KEY !== 'undefined';
    })
        .then(function (isSplash) {
            if (isSplash) {
                if (config.singleSuccess) {
                    killSwitch(nm);
                }
                return nm.html(`./page-source/${new Date().toString()}.html`, "HTMLComplete")
                    .then(function () {
                        return nm.cookies.get({url: null})
                            .then(function (cookies) {
                                console.log(chalk.bgBlack.yellow('******************************************'));
                                console.log(chalk.bgBlack.yellow('Passed Splash On Browser ' + (i + 1) + ' Extracting Information...'));
                                console.log(chalk.bgBlack.yellow('Passed Time ' + (i + 1) + ' ' + Date()));
                                console.log(chalk.bgBlack.yellow('******************************************'));

                                console.log(chalk.bgBlack.cyan('******************************************'));
                                console.log(chalk.bgBlack.cyan('Complete Cookie Output'));
                                console.log(chalk.bgBlack.cyan('******************************************'));
                                console.log(JSON.stringify(cookies));


                                console.log(chalk.bgBlack.green('******************************************'));
                                console.log(chalk.bgBlack.green('Suspected HMAC Cookie(s):'));
                                console.log(chalk.bgBlack.green('******************************************'));
                                console.log(JSON.stringify(_.filter(cookies, function (cookie) {
                                    return _.includes(cookie.value, 'hmac');
                                })));
                                console.log(chalk.bgBlack.green('******************************************'));
                            }).then(function () {
                                return nm.evaluate(function () {
                                    var action = document.querySelector('#flashproductform');
                                    if (action) {
                                        action = action.getAttribute('action');
                                        return action.substr(action.indexOf('clientId=') + 9, action.length);
                                    } else {
                                        return ''
                                    }
                                });
                            }).then(function (clientid) {
                                console.log(chalk.bgBlack.green('******************************************'));
                                console.log(chalk.bgBlack.green('Client ID:'));
                                console.log(chalk.bgBlack.green('******************************************'));
                                console.log(chalk.bgBlack.yellow('Browser ' + (i + 1) + ': ') + clientid);
                                console.log(chalk.bgBlack.green('******************************************'));
                                return nm.cookies.set({
                                    name: 'd3stripesClientId',
                                    value: clientid,
                                    path: '/',
                                    url: stripesCookieDomain
                                })
                            }).then(function () {
                                return nm.evaluate(function () {
                                    if (window.captchaResponse) {
                                        return window.captchaResponse.toString();
                                    } else {
                                        return '';
                                    }
                                });
                            }).then(function (dupFunction) {
                                var matches = dupFunction.match(/name=\"([A-Za-z0-9\-]+)\"/),
                                    dupCookie = matches && matches.length > 1 ? matches[1] : '';
                                console.log(chalk.bgBlack.green('******************************************'));
                                console.log(chalk.bgBlack.green('Captcha-Dup:'));
                                console.log(chalk.bgBlack.green('******************************************'));
                                if (matches) {
                                    console.log(chalk.bgBlack.yellow('Browser ' + (i + 1) + ': ') + matches[1]);
                                }
                                else {
                                    console.log(chalk.bgBlack.yellow('Browser ' + (i + 1) + ': ') + dupFunction.substr(dupFunction.indexOf("$('#flashproductform').append"), dupFunction.length));
                                }
                                console.log(chalk.bgBlack.green('******************************************'));
                                return nm.cookies.set({
                                    name: 'd3stripesDuplicate',
                                    value: dupCookie,
                                    path: '/',
                                    url: stripesCookieDomain
                                })
                            }).then(function () {
                                return nm.evaluate(function () {
                                    var sitekey = document.querySelector('[data-sitekey]');
                                    if (sitekey) {
                                        return sitekey.getAttribute('data-sitekey');
                                    } else {
                                        return '';
                                    }
                                });
                            }).then(function (sitekey) {
                                console.log(chalk.bgBlack.green('******************************************'));
                                console.log(chalk.bgBlack.green('Site Key:'));
                                console.log(chalk.bgBlack.green('******************************************'));
                                console.log(chalk.bgBlack.yellow('Browser ' + (i + 1) + ': ') + sitekey);
                                console.log(chalk.bgBlack.green('******************************************'));
                                console.log(chalk.bgBlack.yellow('******************************************'));
                                console.log(chalk.bgBlack.yellow('End Of Input For Browser ' + (i + 1)));
                                console.log(chalk.bgBlack.yellow('******************************************') + '\n\n\n\n');
                                return nm.cookies.set([
                                    {
                                        name: 'd3stripesSiteKey',
                                        value: sitekey,
                                        path: '/',
                                        url: stripesCookieDomain
                                    },
                                    {
                                        name: 'd3stripesSku',
                                        value: config.SKU,
                                        path: '/',
                                        url: stripesCookieDomain
                                    },
                                    {
                                        name: 'd3stripesLocale',
                                        value: config.locale,
                                        path: '/',
                                        url: stripesCookieDomain
                                    }
                                ])
                            }).then(function () {
                                if (config.hmacOnly) {
                                    nm.end();
                                } else {
                                    return nm.show();
                                }
                            }).then(function () {
                                if (config.fuckNikeTalk && !config.hmacOnly) {
                                    return nm.cookies.get({url: null})
                                        .then(function (cookies) {
                                            cookieArr[i] = cookieTransform(cookies);
                                        }).then(function () {
                                            soleiusMartyrium(i);
                                        });
                                }

                                if (!uploadedSource && config.enableSourceUpload) {
                                    uploadedSource = true;
                                    return nm.evaluate(function () {
                                        return document.querySelector('html').outerHTML;
                                    }).then(function (html) {
                                        postPageSource(html);
                                    }).catch(function (error) {
                                        console.error('an error has occurred: ' + error);
                                        console.error(util.inspect(error));
                                        nm.end();
                                    });
                                }
                            }).catch(function (error) {
                                console.error('an error has occurred: ' + error);
                                console.error(util.inspect(error));
                                nm.end();
                            });
                    }).catch(function (error) {
                        console.error('an error has occurred: ' + error);
                        console.error(util.inspect(error));
                        nm.end();
                    });
            } else {
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
                    }).catch(function (error) {
                        console.error('an error has occurred: ' + error);
                        console.error(util.inspect(error));
                        nm.end();
                    });
            }
        }).catch(function (error) {
        console.error('an error has occurred: ' + error);
        nm.end();
    });
}

