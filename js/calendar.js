function addCalendar(calobject,icsUrlorg){
	icsUrl = icsUrlorg;
	
	if(typeof(icsUrl.url)!=='undefined'){
		var random = getRandomInt(1,100000);
		var html = '<div class="modal fade" id="calendar_'+random+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
		  html+='<div class="modal-dialog">';
			html+='<div class="modal-content">';
			  html+='<div class="modal-header">';
				html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
			  html+='</div>';
			  html+='<div class="modal-body">';
				  html+='<iframe data-src="'+icsUrl.url+'" width="100%" height="570" frameborder="0" allowtransparency="true"></iframe> '; 
			  html+='</div>';
			html+='</div>';
		  html+='</div>';
		html+='</div>';
		$('body').append(html);
		calobject.find('.transbg').addClass('hover');
		calobject.attr('data-toggle','modal');
		calobject.attr('data-id','');
		calobject.attr('data-target','#calendar_'+random);
		calobject.attr('onclick','setSrc(this);');
	}
	
	if(typeof(icsUrl.icalurl)!=='undefined'){
		icsUrl = icsUrl.icalurl.replace(/webcal?\:\/\//i, "https://");
	}
	
	var maxitems = 10;
	if(typeof(icsUrl.maxitems)!=='undefined') maxitems = icsUrl.maxitems;

	calobject.find('.transbg').html('Loading...');
	icsUrl = icsUrl.replace('https://cors-anywhere.herokuapp.com/','');
	var calitems = {}
	$.getJSON('https://cors-anywhere.herokuapp.com/http://ical-to-json.herokuapp.com/convert.json?url='+encodeURI(icsUrl),function(data){
		calobject.find('.transbg').html('');
		for(e in data.calendars[0].events){
			event = data.calendars[0].events[e];
			var startdate = moment(event.dtstart).format(_ICALENDAR_DATEFORMAT);

			var startdateStamp = moment(event.dtstart).format('X');
			var enddate = moment(event.dtend).format('HH:mm');
			if(startdate=='Invalid date'){
				if(event.dtstart[0].length==8){
					var startdate = moment(event.dtstart[0]).format(_ICALENDAR_DATEFORMAT).replace('00:00','') + 'Hele dag';
				}
				else {
					var startdate = moment(event.dtstart[0]).format(_ICALENDAR_DATEFORMAT);
				}
				var startdateStamp = moment(event.dtstart[0]).format('X');
			}
			if(enddate=='Invalid date'){
				console.log(event);
				if(event.dtend[0].length==8){
					var enddate = '';
				}
				else {
					var enddate = moment(event.dtend[0]).format(_ICALENDAR_DATEFORMAT);
				}
			}

			if(enddate!=='') enddate =' - ' + enddate;

			event.enddate = enddate;
			event.startdate = startdate;

			calitems[startdateStamp] = event;
			
		}
		
		var counter = 1;
		
		for(c in calitems){
			if(c > moment().format('X') && counter < maxitems){
				var widget = '<div style="color:'+calitems[c].color+'">' + calitems[c]['startdate'] + calitems[c]['enddate'] + ' - <b>' + calitems[c].summary + '</b></div>';		
				calobject.find('.transbg').append(widget);
				counter++;
			}
		}
		
		setInterval(function(){
			addCalendar(calobject,icsUrlorg)
		},(60000*5));
		
	});
	/*
	new ical_parser(icsUrl, function(cal) {
		calobject.find('.transbg').html('');
		var events = cal.getFutureEvents();
		var counter = 0;
		calobject.find('.transbg').html('');
		counter=0;
		events.forEach(function(event) {
			if (counter < 15) {
				var date = event.start_date;
				var time = event.start_time;
				console.log(event);
				if(_ICALENDAR_DATEFORMAT == 'friendly') {
					var widget = '<div style="color:'+event.color+';">' + moment(date+' '+time,'DD/MM/YYYY HH:mm').locale(_ICALENDAR_LOCALE).calendar() + ' - <b>' + event.SUMMARY + '</b></div>';	
				} 
				else { 
					var widget = '<div style="color:'+event.color+'">' + moment(event.DTSTART,'DD/MM/YYYY HH:mm').format(_ICALENDAR_DATEFORMAT) + ' - <b>' + event.SUMMARY + '</b></div>';		
				}
				calobject.find('.transbg').append(widget);
			}
			counter++;
		});

		setInterval(function(){
			addCalendar(calobject,icsUrlorg)
		},(60000*5));

	});
	*/
	
}