+(function($){
	var defaults = {
		width: null, //弹出层宽度
 			height: null,  //弹出层高度
 			autoSize: true,  //是否自适应尺寸,默认自适应
 			autoHide: false,  //是否自自动消失，配合time参数共用
 			time: 3000,  //自动消失时间，单位毫秒
 			zIndex: 99999,  //弹出层定位层级
 			hasMask: false,  //是否显示遮罩层
 			hasClose: false,  //是否显示关闭按钮
 			hasBtn: false,  //是否显示操作按钮，如取消，确定
 			confirmValue: null,  //确定按钮文字内容
 			confirm: function(){}, //点击确定后回调函数
 			cancelValue: null,  //取消按钮文字内容
 			cancel: function(){},  //点击取消后回调函数，默认关闭弹出框
 			effect: '', //动画效果：fade(默认),newspaper,fall,scaled,flip-horizontal,flip-vertical,sign,
 			type: 'normal', //对话框类型：normal(普通对话框),correct(正确/操作成功对话框),error(错误/警告对话框)
 			title: '',  //标题内容，如果不设置，则连同关闭按钮（不论设置显示与否）都不显示标题
 			content: ''  //正文内容，可以为纯字符串，html标签字符串，以及URL地址，当content为URL地址时，将内嵌目标页面的iframe。
	}

	function Dialog(element,options){
		this.element = element;
 		this.settings = $.extend({}, defaults, options);
 		this.init();
	}

	Dialog.prototype = {
		init:function(){
			this.render();
			this.setStyle();
			this.trigger();
		},
		render:function(){
			var that = this, $this = $(that.element),
				dialogHTML = that.create(),
				$content = that.parseContent();

			$this.replaceWith(dialogHTML[0] + dialogHTML[1]);

			if(typeof($content) === 'object'){
 				$content.appendTo('.dialog-content');
 			}else{
 				$('.dialog-content').append($content);
 			}
			$('body').append(dialogHTML[2]);
		},
		create:function(){
			var that = this,
				$this = that.element,
				title = that.settings.title,
				hasClose = that.settings.hasClose,
				hasMask = that.settings.hasMask,
				hasBtn = that.settings.hasBtn,
				confirmValue = that.settings.confirmValue,
				cancelValue = that.settings.cancelValue,
				content = that.settings.content,
				dialogHTML = [];
				if(!title){
					dialogHTML[0] = '<div class="dialog-box"><div class="dialog-container"><div class="dialog-content"></div>';
				}else{
					if(!hasClose){
						dialogHTML[0] = '<div class="dialog-box"><div class="dialog-container"><div class="dialog-title"><h3>title</h3></div><div class="dialog-content"></div>';
					}else{
						dialogHTML[0] = '<div class="dialog-box"><div class="dialog-container"><div class="dialog-title"><h3>title</h3><a href="javascript:void(0)" class="dialog-close-btn">×</a></div><div class="dialog-content"></div>';						
					}
				}

				if(!hasBtn){
					dialogHTML[1] = '</div></div>';
				}else{
					if(confirmValue &&　cancelValue){
						dialogHTML[1] = '<div class="dialog-btns"><span class="dialog-btns-cancel">' + cancelValue + '</span><span class="dialog-btns-confirm">' + confirmValue + '</span></div></div></div>';
					}else if(confirmValue){
						dialogHTML[1] = '<div class="dialog-btns"><span class="dialog-btns-confirm">' + confirmValue + '</span></div></div></div>';
					}else if(cancelValue){
						dialogHTML[1] = '<div class="dialog-btns"><span class="dialog-btns-cancel">' + cancelValue + '</span></div></div></div>';
					}else{
						dialogHTML[1] = '<div class="dialog-btns"><span class="dialog-btns-cancel">取消</span><span class="dialog-btns-confirm">确定</span></div></div></div>';
					}
				}

				if(hasMask){
					dialogHTML[2] = '<div class="dialog-mask"></div>';
				}else{
					dialogHTML[2] = '';
				}

				return dialogHTML;
		},
		parseContent:function(){
			var that = this,
				content = that.settings.content,
				$iframe = $("<iframe>");
				urlReg = /^(https?:\/\/|\/|\.\/|\.\.\/)/;
				if(urlReg.test(content)){
					$iframe.attr({
	 					src: content,
	 					frameborder: 'no',
	 					scrolling: 'no',
	 					name: 'dialog-iframe',
	 					id: 'dialog-iframe'
	 				})
	 				return $iframe;
				}else{
					return content;
				}
		},
		setStyle:function(){
			var that = this,
				$dialog = $(".dialog-box"),
				$container = $(".dialog-container"),
				$content = $(".dialog-content"),
				width = parseInt($content.css("padding-left")) + parseInt($content.css("padding-right")) + parseInt($content.css("margin-left")) + parseInt($content.css("margin-right")),
				height = $(".dialog-container>.dialog-title").outerHeight() + $(".dialog-container>.dialog-btns").outerHeight() + parseInt($content.css("padding-top")) + parseInt($content.css("padding-bottom")) + parseInt($content.css("margin-top")) + parseInt($content.css("margin-bottom"));

			$dialog.css({
				width:function(){
					if(that.settings.width){
						return that.settings.width +　'px';
					}else{
						return;
					}
				},
				height:function(){
					if(that.settings.height){
						return that.settings.height +　'px';
					}else{
						return;
					}
				},
				'margin-top':function(){
					return - Math.round(that.settings.height/2) + 'px';
				},
				'margin-left':function(){
					return - Math.round(that.settings.width/2) + 'px';
				}
			});

			$container.css({
				width:function(){
					if(that.settings.width){
						return that.settings.width +　'px';
					}else{
						return;
					}
				},
				height:function(){
					if(that.settings.height){
						return that.settings.height +　'px';
					}else{
						return;
					}
				}
			});

			$content.css({
				width:function(){
					if(that.settings.width){
						return (that.settings.width - width) +　'px';
					}else{
						return;
					}
				},
				height:function(){
					if(that.settings.height){
						return (that.settings.height - height) +　'px';
					}else{
						return;
					}
				}
			});
		},
		trigger:function(){
			var that = this, $this = that.element;

			$(document).on("click",".dialog-mask, .dialog-close-btn, .dialog-btns-cancel, .dialog-btns-confirm",function(){
				that.hide($this);
			});

			$(document).on("keyup",function(e){
				e.keyCode == 27 ? that.hide($this) : '';
			});

			$(document).on("click",'.dialog-btns-cancel',function(){
				if($.isFunction(that.settings.cancel)){
					that.settings.cancel();
				}
			})

			$(document).on("click",'.dialog-btns-confirm',function(){
				if($.isFunction(that.settings.confirm)){
					that.settings.confirm();
				}
			})

			if(that.settings.autoHide){
				setTimeout(function(){
					that.hide($this);
				},that.settings.time);
			}
		},
		hide:function(element){
			var $this = $(element),
				$dialog = $(".dialog-box");

				$dialog.replaceWith('<div id="' + $this.attr("id") + '"></div>');
				$(".dialog-mask").remove();
		},
	}

	$.fn.dialog = function(options) {
    return this.each(function(e) {
        new Dialog(this,options);
    });
  }
})(jQuery)