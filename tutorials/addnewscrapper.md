{@tutorial Add-new-Scrapper}

* * *

> This tutorial should introduce you to the scrapper, data mining part off coin_board app, it assume that you have already created an account
> thanks to the /register page

* * *

## First on the /datajunk page,

### 1) Add a new scrapper

| Property |                     Usage                    |     DefVal     |
| -------- | :------------------------------------------: | :------------: |
| **Name** | This is your scrapper! name it like you want | MichelScrapper |

## Then still on the same view,

### 2) Add a source for your Scrapper

| Property         |                                                    Usage                                                    |
| ---------------- | :---------------------------------------------------------------------------------------------------------: |
| **Genre**        |  This is the internal organization of the parser model, choose on the Bank, Crypto or Market kind of source |
| **Type**         |           The scrapper will get the requested content depending on his type. (info, prices, other)          |
| **Name**         |                                  The name (id) of the source you are adding                                 |
| **URL**          | This is the 'may be tricky' part, for reference, see {@link module:datajunk~djunk.MOQREQUEST} documentation |
| **Request host** |                                                     idem                                                    |
| **Request path** |                                                     idem                                                    |

**NOTES :**                        This is this WIP state , user experience will be improved next, for example in its actual state the `&param=foo` kind off settings have to be inserted plain text in db with the **Request path** field, part of the future improvements will consist to have a user friendly input field to automatically set selected params in requested url.

## Finally click on save button and tadaa... !

### 3) See its recorded datas after the page refresh

## Now go to /datajunk/scrapper to launch your newly created scrapper object
