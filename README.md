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

##Todo

* Kill Switch after 1 browser has passed queue
