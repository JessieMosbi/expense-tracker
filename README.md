# Expense-Tracker
這是個簡易的記帳系統，用 [Node.js](https://nodejs.org/en/)、[Express](https://expressjs.com/)、[mongodb](https://www.mongodb.com/) 所打造，使用者註冊並登入後，可自行新增、修改支出，並可依照類別進行篩選

![scrrenshot](https://github.com/JessieMosbi/expense-tracker/blob/master/screenshot.png?raw=true)

## Requirement
[Node.js](https://nodejs.org/en/)   
[mongodb](https://www.mongodb.com/)

## Packages
此專案用到以下 JS library，可藉由 `npm install` 指令去安裝（請參考底下 Installing 步驟）   
[express](https://expressjs.com/)   
[express-handlebars](https://www.npmjs.com/package/express-handlebars)   
[body-parser](https://www.npmjs.com/package/body-parser)   
[method-override](https://www.npmjs.com/package/method-override)   
[mongoose](https://mongoosejs.com/)   
[express-session](https://www.npmjs.com/package/express-session)   
[passport](http://www.passportjs.org/)   
[passport-local](http://www.passportjs.org/packages/passport-local/)   
[passport-facebook](http://www.passportjs.org/packages/passport-facebook/)   
[bcryptjs](https://www.npmjs.com/package/bcryptjs)   
[connect-flash](https://www.npmjs.com/package/connect-flash)   
[dotenv](https://www.npmjs.com/package/dotenv)

***

## Installing
開啟終端機 (Terminal)，透過 `git clone` 指令將專案下載下來到本機端
```console
git clone https://github.com/JessieMosbi/expense-tracker
```

進入 expense-tracker 資料夾內，並檢查是否有 package.json 檔案
```console
cd expense-tracker
```

執行 `npm install`，將專案所需套件下載下來
```console
npm install
```

## Setting
因此專案有結合 Facebook API，故需在 Facebook for developers 上設定一個應用程式，並把資訊填入 .env 檔才能正常啟用
.env 請放在根目錄底下
```console
// .env
FACEBOOK_ID=xxxxxxxx
FACEBOOK_SECRET=xxxxxxxx
FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
```

## Executing
請在 mongodb 底下新增 expense-tracker 資料庫   
進到存放 mongodb 指令的 bin 資料夾，啟動 mongodb

下方範例的 mongodb 資料夾為根目錄底下的 mongodb/，存放資料庫紀錄的資料夾為根目錄底下的 mongodb-data/   
(opt) localhost 的 ip 為 127.0.0.1，此行不加也可以，只是會有 WARNING 提醒
```console
cd ~/mongodb/bin
./mongod --dbpath ~/mongodb-data --bind_ip 127.0.0.1
```

(opt) 進到在 Installing 步驟中，專案所安裝的資料夾底下  
並執行專案內的以下程式，自動在資料庫建立種子資料（包含使用者、使用者的支出紀錄），以方便進行測試
```console
cd <Your download directory>/expense-tracker
npm run seeder
```

最後用專案所設定的統一指令，即可執行專案
```console
npm run dev
```

預設 port 為 3000，請直接打開瀏覽器，並在 URL 輸入 http://localhost:3000/ 即可瀏覽網頁

## Other steps


## Features
種子資料中的使用者資料如下
|Name    | Email                           | Password  |
|:------:|:-------------------------------:|:---------:|
|user1   | user1<span>@example.com</span>  | 12345678  |
|user2   | user2<span>@example.com</span>  | 12345678  |

+ 註冊、登入（可用 Facebook 登入）
+ 首頁可一次瀏覽所有支出的清單，且可查看所有支出清單的總金額
+ 在首頁上方可選擇類別，選擇後底下的清單、總金額將會按照類別進行篩選與總計
+ 點選任一支出右方的的修改按鈕，可進入修改頁面，修改該支出資料
+ 點選任一支出右方的的刪除按鈕，可將該支出刪除
+ 點選首頁下方的新增按鈕，可進入新增頁面，新增一筆支出資料
