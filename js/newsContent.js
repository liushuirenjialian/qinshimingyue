
function readContent(options) {
	// console.log(this.getArgs(options.url))
	this.url = '';
	if(this.getArgs(options.url) != undefined) {
		this.theArgs = this.getArgs(options.url);
		if(this.theArgs.post_id != undefined) {
			this.url = options.reqUrl + this.theArgs.post_id + options.args;
			// console.log(this.url)
		} 
	} else {
		console.log('没有要读取的新闻内容！');
		return;
	}
	this.cats = options.cats;
	this.titles = options.titles;
	this.imgWidth = options.imgWidth;
	this.init();
	
}
readContent.prototype = {
	init: function() {
		var o = this;
		o.request(function(err, data) {
			if(err) {
				console.log(err);
			} else {
				var _data = data.post;
				if(_data) {
					// o.setTitle();
					o.createHtml(_data);
					o.setStyle();
				}
				
			}
		});
	},
	setTitle: function(){
		var o = this;
		var cat;
		
		if(o.theArgs != undefined) {
			if(o.theArgs.cat != undefined) {
				cat = o.theArgs.cat;
				// console.log('cat'+cat)
			} else {
				return;
			}
		} else {
			return;
		} 
		var len = o.cats.length;
		for(var i = 0; i < len; i++) {
			// console.log(o.cats[i])
			if(o.cats[i] == cat) {
				// console.log('title'+ o.titles[i])
				$('h1.title').text(o.titles[i]);
				break;
			}
		}
	},
	createHtml: function(data){
		$('div.contents').find('h5.author').text('作者：' + data.author.name + ' 发布时间：' + data.date);
		$('div.contents').find('h2.head').text(data.title);
		$('div.contents').find('div.content').html(data.content)
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
	setStyle: function() {
		var o = this;
		var imgs = $('div.contents').find('div.content').find('img');
		/*图片宽度控制 start*/
		if(imgs) {
			imgs.each(function() {
				var width = parseInt($(this).css('width'));
				var height = parseInt($(this).css('height'));
				console.log('width:' + width + '' + 'height:' + height)
				if(width > o.imgWidth) {
					var imgHeight = height / width * o.imgWidth;
					$(this).css({
						width: o.imgWidth,
						height: imgHeight
					});
					console.log('width:' + $(this).css('width') + '' + 'height:' + $(this).height())
				}
			});
		}		
		/*图片宽度控制 end*/

		/*图片位置控制 start*/
		imgs.parent().wrap('<div class="pics"></div>');
		var $pics = $('div.content').find('div.pics');
		console.log($pics)

		$pics.each(function() {
			var $this = $(this);
			var $img = $this.find('img');
			// console.log($img)
			if ($img.hasClass('aligncenter')) {
                $this.css('text-align', 'center');
            }
            if ($img.hasClass('alignleft')) {
                $this.css('text-align', 'left');
            }
            if ($img.hasClass('alignright')) {
                $this.css('text-align', 'right');
            }
            if ($img.hasClass('alignnone')) {
                $this.css('text-align', 'center');
            }
		});
		/*图片位置控制 end*/
	},
	request: function(cal) {
		var o = this;
		$.ajax({
			url: o.url,
			type: 'post',
			dataType: 'jsonp',
			success: function(resp) {
				cal(false, resp);
			},
			error: function(resp) {
				cal(resp);
			}
		});
	}
}

$(function() {
	// var url = 'http://games.hoolai.com/cms/?post_id=' + args['post_id'] + '&json=get_post&include=title,content,author,date';
	var strs = window.location.search;
	// console.log(strs)
	var options = {
		url: strs,
		reqUrl: 'http://games.hoolai.com/cms/?post_id=',
		args: '&json=get_post&include=title,content,author,date',
		 /*parent_cat:260, 
        children_cat:[261, 262, 263, 264],*/
		cats: [261, 262, 263, 264],
		titles: ['最新消息','新闻','公告','活动'],
		imgWidth: 600
	};
	new readContent(options);
});