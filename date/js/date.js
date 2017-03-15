;(function($){

	function DatePicker(element,options){
		this.element = element;
		this.options = options;
		this.init(element)
	}

	DatePicker.prototype = {
		init:function(element){
			this.render(element);
			this.trigger();
		},

		render:function(element){
			var that = this,
					today = new Date(),
					year = today.getFullYear(),
					month = today.getMonth() + 1,
					datepickerHTML = [];
					datepickerHTML[0] = '<div class="datepicker-widget"><a href="javascript:void(0)" class="datepicker-widget-btn datepicker-widget-prev"></a><a href="javascript:void(0)" class="datepicker-widget-btn datepicker-widget-next"></a><h3 class="datepicker-widget-title"><span class="datepicker-widget-title-m" data-m="' + month + '">' + that.formatMonth(month) +'</span>&nbsp;<span class="datepicker-widget-title-y" data-y="' + year + '">' + year + '</span></h3></div>';
			datepickerHTML[1] = '<table class="datepicker-calendar"><thead><tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr></thead><tbody>';
			datepickerHTML[2] = that.renderTbody(year,month) + "</tbody></table>";
			$(element).html(datepickerHTML[0] + datepickerHTML[1] +datepickerHTML[2]);
		},
		createDay:function(year, month){			
			var that = this, date = that.getDateCount(year, month), day = that.getDayCount(year, month), daylist = [];
			for(var i = 1; i < day; i++){
				daylist.push(0);
			}
			for(var i = 0; i < date; i++){
				daylist.push(i+1);
			}
			return daylist;
		},
		getDateCount:function(year, month){
			return(new Date(year,month,0).getDate());
		},
		getDayCount:function(year, month){
			return(new Date(year,month - 1,1).getDay());
		},
		renderTbody:function(year, month){
			var that = this, list = that.createDay(year,month) ,html = "";
			$.each(list,function(i,item){
				if(i % 7 == 0){
					html += "<tr><td>" + trim(item) + "</td>";
				}else if(i % 7 == 6){
					html += "<td>" + trim(item) + "</td></tr>";
				}else{
					html += "<td>" + trim(item) + "</td>";
				}
			})
			return html;

			function trim(i){
				return (i == 0 ? "&nbsp;" : i);
			}
		},
		formatMonth:function(month){
			var monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			return monthArr[month-1];
		},
		trigger:function(){
			var that = this;
			$(".datepicker-widget-next").bind("click",function(){
				that.next();
			})
			$(".datepicker-widget-prev").bind("click",function(){
				that.prev();
			})
		},
		next:function(){
			var that = this, m = $(".datepicker-widget-title-m").data("m"), y = $(".datepicker-widget-title-y").data("y");
			if(m == 12){
				m = 1;
				y += 1;
			}else{
				m += 1;
			}
			$(".datepicker-widget-title-m").data("m",m).html(that.formatMonth(m));
			$(".datepicker-widget-title-y").data("y",y).html(y);
			that.toggleMonth(y,m)
		},
		prev:function(){
			var that = this, m = $(".datepicker-widget-title-m").data("m"), y = $(".datepicker-widget-title-y").data("y");
			if(m == 1){
				m = 12;
				y -= 1;
			}else{
				m -= 1;
			}
			$(".datepicker-widget-title-m").data("m",m).html(that.formatMonth(m));
			$(".datepicker-widget-title-y").data("y",y).html(y);
			that.toggleMonth(y,m)
		},
		toggleMonth:function(y,m){
			var that = this;
			var html = that.renderTbody(y,m);
			$(that.element).find("tbody").html(html);
		}
	}

	$.fn.datepicker = function(options) {
    return this.each(function(e) {
        new DatePicker(this,options);
    });
  }
})(jQuery)