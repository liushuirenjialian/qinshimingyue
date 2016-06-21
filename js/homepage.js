function aysncFetcheNews(news_parent_cat, news_children_cat, video_parent_cat, video_children_cat, title_mark, video_class_name, news_class_name, showNum, video_showNum, eventOn) {
    this.parent = news_parent_cat;
    // this.url = 'http://games.hoolai.com/cms/?cat='+this.parent+'&json=get_category_posts&include=title,categories,date&count=1000';
    this.children = news_children_cat;
    // console.log(this.children.length)
    this.url = 'http://games.hoolai.com/cms/?cat=' + this.parent + '&json=get_category_posts&include=title,categories,date&count=1000';
    this.elem = $('.' + news_class_name);
    this.title = this.elem.find('.title');
    this.contents = this.elem.find('div.contents');
    this.mark = title_mark;
    this.showNum = showNum;

    this.video = $('.' + video_class_name);
    this.video_parent = video_parent_cat;
    this.video_children = video_children_cat;
    this.video_url = 'http://games.hoolai.com/cms/?cat=' + this.video_parent + '&json=get_category_posts&include=custom_fields,categories&count=1000';
    this.video_title = this.video.find('.title');
    this.video_contents = this.video.find('div.contents');
    this.video_showNum = video_showNum;

    this.eventOn = eventOn;

    this.init();
}
aysncFetcheNews.prototype = {
    init: function() {
        var o = this;
        o.elem.find('a.more').attr('href', 'newsList.html?cat=' + o.children[0]);
        // console.log(this.url)
        this.request(this.url, function(err, data) {
            if (err) {
                console.log('nihao');
                console.log(err);
            } else {
                o.data = data.posts;
                // console.log(o.data)
                var len = o.children.length;
                // console.log(o.elem)
                if (len != o.elem.find('.title').children('li').length) {
                    console.log('第二个参数出现问题，与DOM中标题数目不一致！');
                    return;
                }
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        o.createListHtml(o.children[i], o.mark[i]);
                    }
                }
                o.setStyle();
            }
        });
        this.changeNewsContent();

        this.request(this.video_url, function(err, data) {
            if (err) {
                console.log('nihao');
                console.log(err);
            } else {
                o.data = data.posts;
                // console.log(o.data)
                var len = o.video_children.length;
                if (len != o.video.find('.title').children('li').length) {
                    console.log('第二个参数出现问题，与DOM中标题数目不一致！');
                    return;
                }
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        o.createVideoHtml(o.video_children[i]);
                    }
                    // console.log(o.video_contents.find('ul.content'))
                    o.showVideo();
                    o.hideVideo();
                }
                // o.setStyle();				
            }
        });
        this.changeVideoContent();

    },
    request: function(url, cal) {
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
    createVideoHtml: function(cat) {
        var dataOut = this.getDataList(cat);
        var len = dataOut.length;
        var data;
        // console.log(len)

        if (len > 0) {
            if (cat == this.video_children[0]) {
                var str = '<ul class="content current video">';
            } else {
                var str = '<ul class="content">';
            }

            if (len >= this.video_showNum) {
                for (var i = 0; i < this.video_showNum; i++) {
                    data = dataOut[i];
                    if (data.custom_fields.image_small != undefined && data.custom_fields.image != undefined) {
                        str += '<li><img src="' + data.custom_fields.image_small[0] + '" alt="视觉盛宴" url="' + data.custom_fields.image[0] + '"></li>';
                    } else {
                        console.log('后台没有输入图片或视频地址')
                    }
                }
            } else {
                for (var i = 0; i < len; i++) {
                    data = dataOut[i];
                    if (data.custom_fields.image_small != undefined && data.custom_fields.image != undefined) {
                        str += '<li><img src="' + data.custom_fields.image_small[0] + '" alt="视觉盛宴" url="' + data.custom_fields.image[0] + '"></li>';
                    } else {
                        console.log('后台没有输入图片或视频地址')
                    }
                }
            }
            str += '</ul>';

            this.video_contents.append(str);
        } else {
            this.video_contents.append('<ul class="content"></ul>');
        }
    },
    createListHtml: function(cat, mark) {
        var dataOut = this.getDataList(cat);
        var len = dataOut.length;
        var data;
        if (len > 0) {
            if (cat == this.children[0]) {
                var str = '<ul class="content current">';
            } else {
                var str = '<ul class="content">';
            }

            if (this.showNum == 'all') {
                for (var i = 0; i < len; i++) {
                    data = dataOut[i];
                    str += '<li><span class="mark">' + mark + '</span><a href="newsContent.html?post_id=' + data.id + '&cat=' + cat + '">' + data.title + '</a><span class="time">' + this.getDate(data.date) + '</span></li>';
                }
            } else {
                if (len >= this.showNum) {
                    for (var i = 0; i < this.showNum; i++) {
                        data = dataOut[i];
                        str += '<li><span class="mark">' + mark + '</span><a href="newsContent.html?post_id=' + data.id + '&cat=' + cat + '">' + data.title + '</a><span class="time">' + this.getDate(data.date) + '</span></li>';
                    }
                } else {
                    for (var i = 0; i < len; i++) {
                        data = dataOut[i];
                        str += '<li><span class="mark">' + mark + '</span><a href="newsContent.html?post_id=' + data.id + '&cat=' + cat + '">' + data.title + '</a><span class="time">' + this.getDate(data.date) + '</span></li>';
                    }
                }
            }

            str += '</ul>';

            this.contents.append(str);
            // this.elem.find('a.more').attr('href','newsList.html?cat=' + cat);
        } else {
            this.contents.append('<ul class="content"></ul>');
        }
    },
    changeNewsContent: function() {
        var o = this;
        o.elem.find('.title').on(this.eventOn, 'li', function() {
            $(this).find('a').addClass('current').parent('li').siblings('li').children('a').removeClass('current');
            var index = o.title.find('li').index($(this));
            o.contents.find('ul.content').eq(index).addClass('current').siblings('ul.content').removeClass('current');
            o.elem.find('a.more').attr('href', 'newsList.html?cat=' + o.children[index]);
            // console.log(o.title.find('li').index($(this)))
        });
    },
    showVideo: function() {
        var o = this;
        var $video = $('video#video');
        var src = '';
        // var scrollWidth = document.documentElement.scrollWidth || document.body.scrollWidth;
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        // console.log($video)
        // console.log(o.video_contents.find('ul.content'))
        o.video_contents.find('ul.content.video').on('click', 'li', function() {
            src = $(this).find('img').attr('url');
            $video.attr('src', 'http://cdn.hoolaiimg.com/video/intro31.mp4').css('display', 'block');
            $('div.shadow').css({
                display: 'block',
                height: scrollHeight
            });
        });
    },
    hideVideo: function() {
        $('div.shadow').click(function() {
            $(this).css('display', 'none');
            $('video#video').attr('src', '').css('display', 'none');
        });
    },
    changeVideoContent: function() {
        var o = this;
        o.video.find('ul.title').on(this.eventOn, 'li', function() {
            $(this).find('a').addClass('current').parent('li').siblings('li').children('a').removeClass('current');
            var index = o.video_title.find('li').index($(this));
            o.video_contents.find('ul.content').eq(index).addClass('current').siblings('ul.content').removeClass('current');
        });
    },
    setStyle: function() {
        this.elem.find('div.contents').css({
            position: 'relative'
        });
        this.elem.find('ul.content').css({
            position: 'absolute',
            top: '0px',
            left: '0px'
        });
        // this.elem.find('ul.content.current').css('display','block');
        // this.elem.find('ul.content').find('li').css({
        // 	height: '35px',
        // 	width: '95%',

        // });
    },
    getDate: function(date) {
        var _date = date.substr(5, 5);
        return _date;
    },
    getDataList: function(cat) {
        var dataList = [];
        var dataLen = this.data.length;
        // console.log(dataLen);
        for (var i = 0; i < dataLen; i++) {
            var catLen = this.data[i].categories.length;
            for (var j = 0; j < catLen; j++) {
                if (this.data[i].categories[j].id == cat) {
                    dataList.push(this.data[i]);
                }
            }
        }
        return dataList;
    }
}

/*滑动控件 start*/
/*<div class=className></div>*/
/*className:包围滑动图片的外层div的className,
width: 图片宽度, 
height图片高度, 
timeSlide:滑动一幅图片所需时间, 
timeStop: 滑动后的间隔时间, 
imgsNum: 图片数目, 
showNum:每次显示的数目, 
col: 一列图片的数目，
direction:方向，还没用过, 
method: slide 或者 fade, 
clickDot: true 或者 false,是否允许点击dot, 
linkUrls: 图片的链接数组，数目与图片一一对应, 
callback:回调函数，暂时没用过
*/
/* 基本的滑动和隐退。需要改进的地方：点击dot滑动有停顿 */
function slideVersion2(className, width, height, timeSlide, timeStop, imgsNum, showNum, direction, method, clickDot, linkUrls, callback) {
    this._className = className;

    this._width = width;
    this._height = height;
    this.elem = $(this._className);
    // this.imgs = this.elem.find('ul.imgs').find('li').find('img');
    this.imgsSize = imgsNum;
    // console.log(this.imgsSize)
    // console.log(this.imgsSize);
    this._timeSlide = timeSlide;
    this._timeStop = timeStop;
    this._showNum = showNum;
    // this.col = col;
    this._direction = direction;
    this._method = method;
    this._clickDot = clickDot;
    this._linkUrls = linkUrls;
    // console.log(this._linkUrls[0]);
    this._callback = callback;
    this.slideIndex = 0;
    this.fadeIndex = -1;
    this.init();
}
slideVersion2.prototype = {
    init: function() {
        this.elem.find('ul.imgs').find('li').find('img').eq(0).show().addClass('current').parent('li').siblings('li').find('img').removeClass('current');
        this.createImgs();
        if(this._clickDot) {
            this.createDots();
            // this.clickDot();
        }
        
        this.setStyle();
        if(this._method == 'slide') {
            this.elem.find('ul.dots').find('li').eq(0).animate({width:'40px'}).siblings('li').animate({width:'20px'});
        }else{
            this.elem.find('ul.dots').find('li').eq(0).css('background-color','#000').siblings('li').css('background-color','#fff');
            this.elem.find('ul.imgs').find('li:first-child').find('img').css('display','block').parent('a').parent('li').siblings('li').find('img').css('display','none');
        }
        // if(this.elem.find('ul.imgs').find('li').length > 0) {
        this.start();
        if(this._clickDot) {
            this.clickDot();
        }
        
        var o = this;
        this.elem.hover(function() {
            clearInterval(o.timer);
        }, function() {
            o.start();
        }); 
        
    },
    getIndex: function() {
        return this.elem.find('ul.imgs').find('li').find('img').index(this.elem.find('img.current'));
    },
    start: function() {
        if (this.timer != null && this.timer != "clear") {
            this.stop();
        }
        var o = this;
        // this.elem.find('ul.dots').find('li').eq(0).css('background-color','#000').siblings('li').css('background-color','#fff');
        if (o._method == 'fade') {
            o.elem.find('ul.imgs').css('width',o._width);
            o.elem.find('ul.imgs').find('li').css({'position':'absolute','left':'0px','top':'0px'});

            o.timer = window.setInterval(function() {
                o.changeFade(o);
            }, o._timeStop);
        } else if (o._method == 'slide') {

            if (o.elem.find('ul.imgs').find('li').length < o._showNum) {
                // console.log('error')
                return;
            }
            o.elem.find('ul.imgs').css('width',(parseInt(this._width)*o.imgsSize+50)+'px');
            o.elem.find('ul.imgs').find('li').css('float','left');
            o.timer = window.setInterval(function() {
                o.changeSlide(0);
                o.slideIndex = (o.slideIndex+1)%o.imgsSize;
                // o.slideIndex++;
                // console.log(o.slideIndex)
                if(o._method == 'slide') {
                    o.elem.find('ul.dots').find('li').eq(o.slideIndex).animate({width:'40px'}).siblings('li').animate({width:'20px'});
                }else{
                    o.elem.find('ul.dots').find('li').eq(o.slideIndex).css('background-color','#000').siblings('li').css('background-color','#fff');
                }
                // o.elem.find('ul.dots').find('li').eq(o.slideIndex).animate({width:'40px'}).siblings('li').animate({width:'20px'});
                // o.elem.find('ul.dots').find('li').eq(o.slideIndex).css('background-color','#000').siblings('li').css('background-color','#fff');
            }, o._timeStop);
        }
    },
    stop: function() {

    },
    changeFade: function(o) {
        // var index = this.getIndex();
        var o = this;

        if (o.fadeIndex + 1 <= this.imgsSize - 1) {
            o.fadeIndex++;
        } else {
            o.fadeIndex = 0;
        }
        this.elem.find('ul.dots').find('li').eq(o.fadeIndex).css('background-color','#000').siblings('li').css('background-color','#fff');
        this.elem.find('ul.imgs').find('li').find('img').eq(o.fadeIndex).addClass('current').fadeIn(this._timeSlide).parent('a').parent('li').siblings('li').find('img').removeClass('current').fadeOut(this._timeSlide);
        this._callback(o.fadeIndex);
    },
    
    changeSlide: function(ind) {
        var o = this;
        var $first = this.elem.find('ul.imgs').find('li:first-child');
        $first.animate({
            marginLeft: -$first.outerWidth(true)
        }, this._timeSlide, function() {
            $(this).css({
                marginLeft: 0
            }).appendTo(o.elem.find('ul.imgs'));
            if(ind-1 >= 0) {
                o.changeSlide(ind-1);
            }
            
        });
    },
    clickDot: function() {
        var o = this;
        var dots = o.elem.find('ul.dots').find('li');
        o.elem.delegate('ul.dots li', 'click', function() {
            if(o._method == 'slide') {
                var index = o.slideIndex;
                o.slideIndex = dots.index(this);
                // console.log(o.slideIndex);

                var ind = ((o.slideIndex-index)>0?(o.slideIndex-index-1):(o.slideIndex-index+o.imgsSize-1));
                o.changeSlide(ind);

                o.elem.find('ul.dots').find('li').eq(o.slideIndex).animate({width:'40px'}).siblings('li').animate({width:'20px'});
            } else if(o._method == 'fade') {
                o.fadeIndex = dots.index(this)-1;

                o.changeFade(o);
            }
        });
    },
    createDots: function() {
        var str = '<ul class="dots">';
        for(var i = 0; i < this.imgsSize; i ++) {
            str += '<li></li>';
        }
        str += '</ul>';
        this.elem.append(str);
    },
    createImgs: function() {
        var str = '<ul class="imgs">';
        for(var i = 0; i < this.imgsSize; i ++) {
            str += '<li><a href="#"><img src="./images/homepage/slide/slide' + i + '.jpg"></a></li>'
        }
        str += '</ul>';
        this.elem.append(str);
    },
    setStyle: function() {
        // console.log($('.slide').css('position'));
        if(this.elem.css('position') != 'absolute') {
            this.elem.css('position', 'relative');
        } 
        this.elem.css({
            width: this._width ,
            height: this._height,
            overflow: 'hidden'
        });
        this.elem.find('ul.imgs').css({
            width: parseInt(this._width)*this.imgsSize+'px',
            height: this._height
        });
        this.elem.find('ul.imgs').find('li').css({
            width: this._width ,
            height: this._height
        });
        this.elem.find('ul.dots').css({
            textAlign: 'center',
            position: 'absolute',
            bottom: '15px',
            width: '100%'
        });
        this.elem.find('ul.dots').find('li').css({
            width: '20px',
            height: '20px',
            borderRadius: '10px',
            display: 'inline-block',
            marginLeft: '15px',
            background: 'rgba(255,255,255,1)'
        });

    }
   
}
/*滑动控件 end*/


$(function() {
    /*自适应高度*/
    var height = document.documentElement.clientHeight;
    console.log(height);
    $('div.bg').css('height',height+'px');

    var options = {
        parent_cat:260, 
        children_cat:[261, 262, 263, 264],
        video_parent_cat: 195,
        video_children_cat: [196, 197, 198],
        title_mark: ['最新', '新闻', '公告', '活动'],
        video_class_name: 'sj',
        news_class_name: 'news',
        showNum: 5,
        video_showNum: 4,
        eventOn: 'click'
    };
    // new aysncFetcheNews(187, [188, 189, 200, 199], ['最新消息','新闻','公告','活动'], 'xw', 5);
    new aysncFetcheNews(options.parent_cat, options.children_cat, options.video_parent_cat, options.video_children_cat, options.title_mark, options.video_class_name, options.news_class_name, options.showNum, options.video_showNum, options.eventOn);

    new slideVersion2('.slide', '640px', '341px', 600,3000,5,1,'','slide', true ,['http://www.baidu.com','#','#','#','#'], function(){});
});
