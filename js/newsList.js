/*
news_parent_cat，video_parent_cat:父目录的cat,
news_children_cat，video_children_cat:子目录的cat数组，
title_mark:mark数组，如最新消息、新闻等，用于标识列表项前的标识，
news_class_name，video_class_name:包围该区域DOM元素的类名，
showNum，video_showNum:允许显示条数'all'或者一个数字，取值为’all‘：全部都显示，取值为一个确定数字：显示条数，  video_showNum只能取数字。
eventOn：click或者mouseover，触发改变内容
*/
function aysncFetcheNews(news_parent_cat, news_children_cat, current, title_mark, news_class_name, showNum) {
	this.parent = news_parent_cat;
	// this.url = 'http://games.hoolai.com/cms/?cat='+this.parent+'&json=get_category_posts&include=title,categories,date&count=1000';
	this.children = news_children_cat;
	// console.log(this.children.length)
	this.url = 'http://games.hoolai.com/cms/?cat='+this.parent+'&json=get_category_posts&include=title,categories,date&count=1000';
	this.elem = $('.' + news_class_name);
	this.title = this.elem.find('.title');
	this.contents = this.elem.find('div.contents');
	this.mark = title_mark;
	this.showNum = showNum;
	if(this.getArgs(current) != undefined) {
		this.current = this.getArgs(current).cat;
	}
	
	// console.log(this.current);
	
	this.init();
}
aysncFetcheNews.prototype = {
	init: function() {
		var o = this;
		// o.elem.find('a.more').attr('href','newsList.html?cat='+o.children[0]);
		// console.log(this.url)
		this.request(this.url,function(err, data) {
			if(err) {
				console.log('nihao');
				console.log(err);
			} else {
				o.data = data.posts;
				// console.log(o.data)
				var len = o.children.length;
				// console.log(o.elem)
				if(len != o.elem.find('.title').children('li').length) {
					console.log('第二个参数出现问题，与DOM中标题数目不一致！');
					return;
				}
				if(len > 0 ) {
					for(var i = 0; i < len; i ++) {
						o.createListHtml(o.children[i], o.mark[i]);
					}
				}
				// console.log(o.contents.find('ul.content').index($('ul.current')));
				var index = o.contents.find('ul.content').index($('ul.current'));
				o.elem.find('ul.title').find('li').eq(index).find('a').addClass('current').parent('li').siblings('li').find('a').removeClass('current');
				o.setStyle();
				// o.showPage();				
			}
		});
		// this.showPage();
		this.changeNewsContent();
		// this.showPage();

		
	},
	request: function(url,cal) {
		$.ajax({
			type: "POST",
			url: url,
			dataType: "jsonp",
			success: function(resp) {
				cal(false, resp);
			},
			error: function(resp) {
				cal(resp);
			} 
		});
	},
	
	createListHtml: function(cat,mark) {
		var dataOut = this.getDataList(cat);
		var len = dataOut.length;
		var data;
		if(len > 0) {
			// if(this.current) {
			// 	if(cat == this.current) {
			// 		var str = '<ul class="content current">';
			// 	}
			// } else if(cat == this.children[0]) {
			// 	var str = '<ul class="content current">';
			// } else {
				
			// }
			console.log(this.current)
			var current = (this.current || this.children[0]);
			// console.log(this.current);
			// console.log(current);
			if(cat == current) {
				var str = '<ul class="content current">';
			} else {
				var str = '<ul class="content">';
			}
			
			if(this.showNum == 'all') {
				for(var i = 0; i < len; i ++) {
					data = dataOut[i];
					str += '<li><a href="newsContent.html?post_id=' + data.id + '&cat=' + cat + '">'+data.title+'</a><span class="time">'+this.getDate(data.date)+'</span></li>';
				}
			} else {
				if(len >= this.showNum) {
					for(var i = 0; i < this.showNum; i ++) {
						data = dataOut[i];
						str += '<li><a href="newsContent.html?post_id=' + data.id + '&cat=' + cat + '">'+data.title+'</a><span class="time">'+this.getDate(data.date)+'</span></li>';
					}
				} else {
					for(var i = 0; i < len; i ++) {
						data = dataOut[i];
						str += '<li><a href="newsContent.html?post_id=' + data.id + '&cat=' + cat + '">'+data.title+'</a><span class="time">'+this.getDate(data.date)+'</span></li>';
					}
				}
			}
			
			str += '</ul>';
			
			this.contents.append(str);
			// this.elem.find('a.more').attr('href','newsList.html?cat=' + cat);
		}else {
			this.contents.append('<ul class="content"></ul>');
		}
		// this.showPage();
	},
	changeNewsContent: function() {
		var o = this;
		o.elem.find('.title').on('click','li',function() {
			$(this).find('a').addClass('current').parent('li').siblings('li').children('a').removeClass('current');
			var index = o.title.find('li').index($(this));
			o.contents.find('ul.content').eq(index).addClass('current').siblings('ul.content').removeClass('current');
			o.elem.find('a.more').attr('href','newsList.html?cat='+o.children[index]);
			// console.log(o.title.find('li').index($(this)))
			// o.showPage();
		});
	},
	setStyle: function() {
		
	},
	getDate: function(date) {
	    var _date = date.substr(5, 5);
	    return _date;
	},
	getDataList: function(cat) {
		var dataList = [];
		var dataLen = this.data.length;
		// console.log(dataLen);
		for(var i = 0; i < dataLen; i ++) {
			var catLen = this.data[i].categories.length;
			for(var j = 0; j < catLen; j ++) {
				if(this.data[i].categories[j].id == cat) {
					dataList.push(this.data[i]);
				}
			}
		}
		return dataList;
	},
	getArgs: function(strs) {
	    var _strs = strs.length > 0 ? strs.substring(1) : '',
	        args = {},
	        items = _strs.split('&'),
	        len = items.length,
	        mame = null,
	        value = null,
	        item = [];
	    if (_strs.length == 0) {
	        console.log('没有要读取的字符串');
	        return;
	    }
	    for (var i = 0; i < len; i++) {
	        item = items[i].split("=");
	        name = item[0];
	        value = item[1];
	        name = decodeURIComponent(item[0]);
	        value = decodeURIComponent(item[1]);
	        args[name] = value;
	    }
	    return args;
	},
	showPage: function() {
		var nextpage = {
			content: 'current',
			pageNav: 'pageAll',
			pageSize: 7,
			activeClass: 'cur',
			ini: '0',
			prevBtn: 'pagePrev',
			nextBtn: 'pageNext'
		};
		// new nextPage(nextpage);
	}
}

$(function() {

	// var options = {
	// 	parent_cat:187, 
	// 	children_cat:[188, 189, 200, 199],
	// 	current: window.location.hash,
	// 	title_mark:['最新消息','新闻','公告','活动'], 
	
	// 	news_class_name:'wrap', 
	// 	showNum:'all'
		
	// };

	// var options = {
	// 	parent_cat:226, 
	// 	children_cat:[227, 228, 230, 229],
	// 	current: window.location.hash,
	// 	title_mark:['最新消息','新闻','公告','活动'], 
	
	// 	news_class_name:'wrap', 
	// 	showNum:'all'
		
	// };
	var options = {
		parent_cat: 170,
        children_cat: [175, 174, 172, 173],
		current: window.location.search,
		title_mark:['最新消息','新闻','公告','活动'], 
	
		news_class_name:'wrap', 
		showNum:'all'
		
	};
	new aysncFetcheNews(options.parent_cat, options.children_cat, options.current, options.title_mark, options.news_class_name, options.showNum);


	// var nextpage = {
	// 	content: 'current',
	// 	pageNav: 'pageAll',
	// 	pageSize: 2,
	// 	activeClass: 'cur',
	// 	ini: '0',
	// 	prevBtn: 'pagePrev',
	// 	nextBtn: 'pageNext'
	// };
	// new nextPage(nextpage);

});