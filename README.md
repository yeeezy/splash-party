# splash-party
Run multiple headless browsers on Adidas.com waiting room

###How it works
Headless browsers will refresh the splash page while creating fresh sessions, once a browser bypasses the waiting room, the browser will then become visible.

**Note:** Currently a browser becoming visible will have focus set to it, so be mindful while you're checking out, another window might pop up - which has a different session that also bypassed queue

###Setup

* install nodejs and npm
* clone repo
* npm install
* node app.js

###Configure
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

###Page Source
After bypassing the Adidas waiting room/splash page, the app will automatically create a `page-source` directory, where it will save the product page's source code.

If you have auto-upload on, your source will be uploaded to https://glot.io/users/yeeezy/snippets

### /// Integration

**this feature has never been tested live**

If you want to use [d3stryr-3stripes](https://github.com/thenikedestroyer/d3stryr-3stripes), you can now do so from inside the program.

set **fuckNikeTalk** to true and set **stripesUrl** to be your local /// url

* once a browser gets to the product page, another window will open under the same session cookies+user-agent with your /// page
* **The title of the browser is the time it opened** - this is important to keep track of your 10 minute cookie
* if multiple windows open -> multiple /// instances will also open, each under a different session, to make things managable just notice the time in the title to understand how long you have for each window

###Disclaimer
Use at your own risk, currently Adidas does not ban multiple sessions from the same IP, it may in the future.

###Session Transfer
There is a built in mechanism to help session transfer - **it has not been tested**

Once one browser bypasses queue, it will become visible and the console will print out javascript code to transfer all cookies, the final printout will be the user agent

For example

```document.cookie='us_criteo_sociomantic_split=';
document.cookie='inf_media_split=';
document.cookie='__adi_rt_DkpyPh8=';
document.cookie='AMCVS_7ADA401053CCF9130A490D4C%=';
document.cookie='RES_TRACKINGID=';
document.cookie='ResonanceSegment=';
document.cookie='RES_SESSIONID=';
document.cookie='_ga=';
document.cookie='s_cc=true';
```


Paste this into a browser console while it is on the Adidas website and you should be OK

##Debugging
* For nightmarejs debugging ```DEBUG=nightmare node app.js```
* For electronjs debugging ```DEBUG=electron* node app.js```

##Todo

* Kill Switch after 1 browser has passed queue
* Add full browser toolbar to top of window
* Auto-Extract sitekey, clientid, page source code, etc.
