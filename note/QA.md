Index
===

+ [前面的部分＆QA](https://github.com/ceparadise168/node-express/blob/master/note/QA.md)

+ Response&Request

+ Template

+ Form

+ cookie&session

+ midleware

+ sent email

---



#前言
這是為了熟悉開發所做的練習，以一個隨機抽字串的幸運餅乾小程式為基礎來練習

# 準備
```
express meadowwlark

安裝完之後將前端引擎換掉
npm install --save express3-handlebars view engine
```

 建立view，為了方便及節省資源，我們將view切成兩部分
 主要的view不變,其他的隨著不同路徑改變

 在主程式建立抽餅乾的function

 bulid main handlebars

 bulid sub handlebars
 
 接著把餅乾給抽出來模組化，讓架構更簡潔明瞭
 


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

+跨頁測試 Zombie.js

+邏輯測試

+Lint JSHint

+連結檢查 LinkChecker

+自動重啟 nodemon

---
+ 網頁測試 Ｍocha

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
---
＃ 建立專用的網頁測試
假設我們想測試一個contact連結是否會在about上，
我們可以建立一個檔案tests-about.js
```
touch public/qa/tests-about.js

suite('"About" Page Tests', function() {
    test('page should contain link to contact page', function() {
        assert($('a[herf="/contact"]').length);
    });
});

```
接著我們要更改about的router來指定測試
```
app.get('/about', function(req,res){
	/*var randomFortune = 
		fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)];
	res.render('about', { fortune: randomFortune });
	*/
	res.render('about',{
		fortune:fortune.getFortune(),
		pageTestScript:'./public/qa/test-about.js'
	});
});
```

接著就可以連接about?test=1來測試


+ 跨頁測試 Zombie.js

首先我們先新增一個旅遊view hood-river tour
以及一個報價view request group rate

```
bash-3.2$ touch views/hood-river.handlebars views/request-group-rate.handlebars
```
接下來我們把相對的路由建立起來
在meadowlark.js中使用get方法加入

```
app.get('/tours/hood-river', function(req, res){
	res.render('hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
	res.render('request-group-rate');
});
```
做好這些之後就可以打開你的瀏覽器跑道hood-river去
然後再點下request-group-rate 來確認表單有沒有成功載入
＊＊＊ 是不是很麻煩 ＊＊＊
我們需要的是一種稱為headless瀏覽器的東西
什麼意思呢？代表我們只需要有訪問這個行為就好，
不用真的去刷新頁面在螢幕上顯示
為了達到這個需求我們有以下套件可以使用：
1. Selenium
2. PhantomJS
3. Zombie
這邊我們使用Zombie來做測試
---
首先先安裝zombie
並建立一個新的資料夾以及測試程式碼
```
一樣使用npm安裝 加上參數保存在packge裡 以及加上測試環境區別
npm install --save-dev zombie
mkdir qa
touch ./qa/test-crosspage.js
```

```
var Browser = require('zombie'),
	assert = require('chai').assert;

var browser;

suite('Cross-Page Tests', function(){
    //每次執行都是新的瀏覽器實例
	setup(function(){
		browser = new Browser();
	});
    //測試每個網頁是否正確
	test('requesting a group rate quote from the hood river tour page should ' +
			'populate the hidden referrer field correctly', function(done){
		var referrer = 'http://localhost:3000/tours/hood-river';
        /*browser.visit()載入後呼叫callbackfunction
        接下來browser.clickLink()方法會用requestGroupRate類別來查看連結
        當載入連結時便會呼叫callbackfunction
        這時我們處於requestGroupRate上
        開始判斷隱形的referrer欄位值是否正確 
        */
		browser.visit(referrer, function(){
			browser.clickLink('.requestGroupRate', function(){
				assert(browser.field('referrer').value === referrer);
				done();
			});
		});
	});
    // 同上對oregon-coast做測試 但他不存在 所以會噴錯
	test('requesting a group rate from the oregon coast tour page should ' +
			'populate the hidden referrer field correctly', function(done){
		var referrer = 'http://localhost:3000/tours/oregon-coast';
		browser.visit(referrer, function(){
			browser.clickLink('.requestGroupRate', function(){
				assert(browser.field('referrer').value === referrer);
				done();
			});
		});
	});
    //  確保有人直接造訪時隱形欄位值為空白
	test('visiting the "request group rate" page dirctly should result ' +
			'in an empty value for the referrer field', function(done){
		browser.visit('http://localhost:3000/tours/request-group-rate', function(){
			assert(browser.field('referrer').value === '');
			done();
		});
	});

});
```
接著就可以直接看測試結果
除了原本的nodemon之外
我們再開一個新的terminal來使用mocha做測試
這邊要確保mocha使用golbal 安裝
```
npm install -g mocha
//將介面指定為TDD 使用spec回報器               將錯誤dump出來
mocha -u tdd -R spec qa/tests-crosspage.js 2>/dev/null
```
了解行為驅動開發ＴＤＤ測試驅動開發ＢＤＤ


+ 邏輯測試

這邊我們一樣使用mocha來做邏輯測試

因為我們只有一個元件所以這邊做單元測試先建立檔案

```
bash-3.2$ touch qa/tests-unit.js
```
```
var fortune = require('../lib/fortune');
var expect = require('../public/vendor/chai').expect;

suite('Fortune cookie tests', function(){
    test('getFortune() shuld return a fortune', function(){
        expect(typeof fortune.getFortune() === 'string');
    });
});

/*
// vendor/chai.js
var expect = require('./chai/interface/expect');
exports.use(expect);
*/

```


```
bash-3.2$ mocha -u tdd -R spec qa/tests-unit.js


  Fortune cookie tests
    ✓ getFortune() shuld return a fortune


  1 passing (9ms)
```

+ Lint JSHint

裝vscode的時候內建有套件 可以幫助檢查一些淺在錯誤

+ 連結檢查 LinkChecker

npm 上有許多套件可以使用


+ 自動重啟 nodemon

nodemon meadowlark.js
---
＃ Grunt

要做到完整的ＱＡ需要許多的套件，每個套件又有不同指令非常麻煩
因此我們使用grunt來幫我們自動完成
```
npm install -g grunt-cli
npm install --save-dev grunt
npm install --save-dev grunt-cafe-mocha grunt-contrib-jshint grunt-exec
```

```
	// use foreach to load plugins
	[
		'grunt-cafe-mocha',
		'grunt-contrib-jshint',
		'grunt-exec',
	].forEach(function(task){
		grunt.loadNpmTasks(task);
	});

```

```
	// configure plugins
	grunt.initConfig({
		cafemocha: {
			all: { src: 'qa/tests-*.js', options: { ui: 'tdd' }, }
		},
		jshint: {

			app: ['meadowlark.js', 'public/js/**/*.js', 'lib/**/*.js'],
			qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
		},
		exec: {
			linkchecker: { cmd: 'linkchecker http://localhost:3000' }
		},
	});	
```
註冊任務
```
grunt.registerTask('default', ['cafemocha','jshint','exec']);
```
輸入grunt來運行
```
grunt 
```
可以看見套件執行的測試結果，讚！

待補充：
# 持續整合 ＣＩ

+ Travis CI 






 
