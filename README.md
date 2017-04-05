# 準備
安裝完之後將前端引擎換掉並將餅乾隨機拉出來模組化
``` npm install --save express3-handlebars view engine
 bulid main handlebars
 bulid sub handlebars
 turn fortunecookies to modules

```
---
複習git
```
git init 
 .gitignore
 git add -A
 git commit -m "getfortune module" 


git remote add origin https://github.com/ceparadise168/node-express.git

 git push -u origin master
 ```

#  About the QA

+網頁測試 Ｍocha

這邊使用dev是因為真正執行時並不需要，所以掛在開發環境下減少依賴數量
因為我們可能會在瀏覽器中執行mocha所以我們需要今mocha資源放入公共資料夾，讓他可以被傳到用戶端
這邊我們通常將第三方程式單獨放到一個目錄以作區別如此一來可以很快知道哪些要測試修改
這邊我們將它們放進publiv/vendor
```
npm install --save-dev mocha
mkdir public/vendor
cp node_modules/mocha/mocha.js public/vendor
cp node_modules/mocha/mocha.css public/vendor

```
測試通常需要一種功能稱為assert(expect) node中有但瀏覽器沒內建
```
npm install --save-dev chai
cp node_module/chai/chai.js public/vendor
```
裝完了之後我們預期使用一個ＵＲｌ參數來啟動，大概長這樣子：
http://localhose:3000?test=1
為此我們要使用一些中介軟體在查詢字串中偵測test=1，他必須在任何想要使用的路由之前出現
```
app.use(function(req, res, next) {
	res.locals.showTestss = app.get('env') !== 'production' && 
	req.query.test === '1';
	next();
});
```
res.locals是要傳遞給view的context的一部分
因此我們修改main.handlebars加入測試框架
在head加入jquery來操作ＤＯＭ
在body加入mocha chai 以及一個稱為global-test.js的全域測試
```
mkdir public/qa
cd public/qa
touch tests-global.js
```
```
//tests-global.js
suite('Global Tests', function(){
	test('page has a valid title', function(){
		assert(document.title && document.title.match(/\S/) && 
			document.title.toUpperCase() !== 'TODO');
	});
});

```


+跨頁測試 Zombie.js

+邏輯測試

+Lint JSHint

+連結檢查 LinkChecker

+自動重啟 nodemon