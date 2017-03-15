(function($) {
  $.Slider = function(ele,options) {
    var _this = $(ele).find("ul");
    _this.index = 0, _this.box = $(ele);
    var _li = _this.find("li");
    _this.opts=$.extend({},$.Slider.defaults, options);
    _this.init = function() {
      _this.getUlWidth();
      _this.box.find(_this.opts.backClass).bind('click',_this.back);
      _this.box.find(_this.opts.forwardClass).bind('click',_this.forward);
    }

    _this.getUlWidth = function() {
      _li.liSize = _li.size();
      _li.liWidth = parseInt(_li.css("width")) || 0;
      _this.css("width",_li.liWidth * _li.liSize);
      _this.next();
    }

    _this.back = function() {
      if(_this.is(":animated")) return;
      if(_this.index == 0){
        return;
      }else if(_this.index < _this.opts.count){
        _this.animate({left: 0}, _this.opts.duration,function(){
          _this.next();
        });
      }else{
        _this.animate({left: "+=" + _this.opts.count *_li.liWidth}, _this.opts.duration,function(){
          _this.next();
        });
      }
    }

    _this.forward = function() {
      if(_this.is(":animated")) return;
      var totalLength = _li.liSize * _li.liWidth;
      var i = (totalLength - _li.liWidth * (_this.index + _this.opts.num))/_li.liWidth;
      if(i == 0){
        return;
      }else if(i < _this.opts.count){
        var length = _li.liSize - _this.opts.num;
        _this.animate({left: -length * _li.liWidth}, _this.opts.duration,function(){
          _this.next();
        });
      }else{
        _this.animate({left: "-=" + _this.opts.count *_li.liWidth}, _this.opts.duration,function(){
          _this.next();
        });
      }
    }

    _this.next = function() {
      _this.updateIndex();
      if(_this.opts.isEffect){
        _li.removeClass('active');
        _li.eq(_this.index + Math.floor(_this.opts.num / 2)).addClass("active");
      }
    }

    _this.updateIndex= function() {
      _this.left = parseInt(_this.css("left"));      
      _this.index = Math.abs(_this.left/_li.liWidth) || 0;
    }

    _this.init();
  }

  $.Slider.defaults={
    count:3, //每次移动的个数
    num:3, //可见个数
    isEffect:true, // 中间放大效果
    duration:500, //切换时间
    backClass:'.back', // 左移class
    forwardClass:'.forward' //右移class
  };

  $.fn.Slider = function(options){
    return this.each(function(i){
      (new $.Slider(this,options));
   });
  };
})(jQuery);