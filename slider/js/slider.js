+ function($) {
	$.fn.Slider = function(options){
		var _this = $(this);

		_this.init = function() {
			_this.opts = $.extend({},$.fn.Slider.defaults,options);
			_this.index = _this.opts.index;
			_this.ul = _this.find(".section");
			_this.initLi();
			_this.pageCount = _this.lis.length;
			_this.timer = null;
			_this.initWidth();
			_this.createPage();
			_this.initLiLabel();
			_this.auto = _this.opts.autoPlay;
			_this.auto && _this.autoPlay();
		}

		_this.initLi = function(){
			_this.lis = _this.ul.find("li");
		}

		_this.initLiLabel = function(){
			_this.lis.each(function(index){
				$(this).data("label",index);
			})
		}

		_this.initWidth = function() {
			_this.find(".section").width(_this.pageCount * 100 + "%");
			_this.lis.width((100 / _this.pageCount).toFixed(2) + "%");
		}

		_this.initEvent = function() {
			$(document).on("click",'.pages>li',function(){
				var currentIndex = $(this).index();
				var index = _this.index;
				_this.next(currentIndex-index);
				console.log(currentIndex-index);
			})

			$(document).on("mouseover",'.sections',function(){
				_this.stopPlay();
			})

			$(document).on("mouseout",'.sections',function(){
				_this.autoPlay();
			})
		}

		_this.createPage = function() {
			var temp = '<ul class="pages">'
			for(var i = 0;i<_this.pageCount;i++){
				temp += '<li' + (i == _this.opts.index ? ' class="active"' : '') + '></li>';
			}
			temp += '</ul>';
			_this.append(temp);
			_this.initEvent();
		}

		_this.autoPlay = function() {
			_this.auto = true;
			var play = function(){
				_this.timer = setTimeout(function(){
					play();
					_this.next(1);
				},_this.opts.stay)
			}
			play();
		}

		_this.stopPlay = function() {
			_this.auto = false;
			clearTimeout(_this.timer);
		}

		_this.next = function(step){
			_this.index += step;
			var left = parseInt(_this.ul.css("left"));
			if(step > 0 && Math.abs(left) >= (_this.lis.width() * (_this.pageCount - step))){
				_this.lis.slice(0,step).appendTo(_this.ul);
				_this.ul.css("left",-(_this.lis.width() * (_this.pageCount - 1 - step)));
				_this.index == _this.pageCount ? _this.index -= _this.pageCount : '';
				_this.initLi();
			}
			_this.ul.animate({left:"-=" + _this.lis.width() * step}, _this.opts.duration,function(){
				_this.changePage();
			});
			
		}

		_this.changePage = function(){
			_this.find(".pages>li").eq(_this.index).addClass('active').siblings().removeClass('active');
		}

		_this.init();

	}
	$.fn.Slider.defaults = {
		index: 0,
    autoPlay: true,
    stay: 3000,//ms
    duration:2000,//ms
    callback: ""
	}
}(jQuery);