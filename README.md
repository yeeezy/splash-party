# splash-party
Run multiple headless browsers on Adidas.com waiting room

## Important Breaking Changes - Made April 26th, 2017 - Must Read

* **gCookies**: You **should not** convert cookies in the jsfiddle any more, copy them straight from EditThisCookie
* **\/\/\/**: If you have enabled /// via splash-party, all cookies are now being copied in a more trustworthy way, and all variables found will be automatically filled in /// when it opens

### Support
There is a subreddit for supporting this repo and other Adidas-related repos

https://www.reddit.com/r/adidasatc


### How it works
Headless browsers will refresh the splash page while creating fresh sessions, once a browser bypasses the waiting room, the browser will then become visible.

**Note:** Currently a browser becoming visible will have focus set to it, so be mindful while you're checking out, another window might pop up - which has a different session that also bypassed queue

### Setup

* install nodejs and npm
* clone repo
* npm install
* node app.js

### Configure
Configuration file can be modified as needed:

* **splashUrl**: Url for the Adidas splash page (or "waiting room")
* **userAgent**: You can set this to be your browsers user agent if you want to transfer sessions for /// use. The other option would be to set your browser to this user agent
* **partySize**: Number of browsers to put on the splash page
* **splashUniqueIdentifier**: This should be some unique selector that exists on splash but does not product page, many exist. If you want, you can reverse the .exists logic in the code and look for the sitekey to know your on the product page
* **waitTime**: number of ms to wait between refreshing (after page has completely loaded)
* **enableSourceUpload**: enables the auto-upload of page source once you hit the product page, to be shared by the community
* **singleSuccess**: set to true if you want all other browsers to stop once you hit the product page with 1
* **fuckNikeTalk**: when a browser passes through to the product page, a new window with /// will open with the same session
* **stripesUrl**: if you set fuckNikeTalk to true, set this to your local /// url
* **hmacOnly**: "hmac mode" - a browser passing splash won't pop the window open, it will only print out the cookies, sitekey, and save the source code. Use this if you're only interested in getting hmac cookie and transfering them to your own browser
* **gCookies**: an array of cookies, **do not leave empty, it will cause program to crash**. See [this repo](https://github.com/yeeezy/captcha-cookies) for explanation on how to build the array. Used properly this will let you through captcha without solving 10 times
* **SKU**: only relevant for /// users, the current product SKU
* **locale**: only relevant for /// users, your adidas locale

### Page Source
After bypassing the Adidas waiting room/splash page, the app will automatically create a `page-source` directory, where it will save the product page's source code.


### Variable Print Out
When a browser reaches the product page, it will attempt to extract and print the sitekey, client-id and captcha-dup.

### /// Integration

**this feature has never been tested live**

If you want to use [d3stryr-3stripes](https://github.com/thenikedestroyer/d3stryr-3stripes), you can now do so from inside the program.

set **fuckNikeTalk** to true and set **stripesUrl** to be your local /// url

* once a browser gets to the product page, another window will open under the same session cookies+user-agent with your /// page
* **The title of the browser is the time it opened** - this is important to keep track of your 10 minute cookie
* if multiple windows open -> multiple /// instances will also open, each under a different session, to make things managable just notice the time in the title to understand how long you have for each window

* all variables found will auto-populate the script when it opens

### G-Cookies
There is now an option to transfer over your g-cookies to pass captcha easily, see config for explanation

### Disclaimer
Use at your own risk, currently Adidas does not ban multiple sessions from the same IP, it may in the future.

### Session Transfer
There is a built in mechanism to help session transfer, all cookies are printed in proper JSON format, then any cookies that seem like hmac cookies are printed (also in proper JSON format)

Transfer any relevant cookies via your favorite browser extension, I recommend EditThisCookie which takes the complete JSON array as input and sets all cookies in 1 easy move

## Debugging
* For nightmarejs debugging ```DEBUG=nightmare node app.js```
* For electronjs debugging ```DEBUG=electron* node app.js```

## Todo

* Add full browser toolbar to top of window

