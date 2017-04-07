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