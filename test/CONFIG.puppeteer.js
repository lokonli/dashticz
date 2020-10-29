var config = {}
config['domoticz_ip'] = 'http://test.lokies.home:8080';
config['user_name'] = '';
config['pass_word'] = '';
config['app_title'] = 'Dashticz';
config['domoticz_refresh'] = '5';
config['dashticz_refresh'] = '600';

var blocks = {
}

blocks['moon']= {
    btnimage: 'moon'
}

var columns = {}

columns[1] = {}
columns[1]['blocks'] = [
    'moon'
]
columns[1]['width'] = 6;

columns[2] = {}
columns[2]['blocks'] = [

]
columns[2]['width'] = 6;

columns[3] = {}
columns[3]['blocks'] = [

]
columns[3]['width'] = 6;

columns[4] = {}
columns[4]['blocks'] = [
]
columns[4]['width'] = 6;

//if you want to use multiple screens, use the code below:
var screens = {}
screens[1] = {}
screens[1]['background'] = 'bg2.jpg';
screens[1]['columns'] = [1,2]

screens[2] = {}
screens[2]['background'] = 'bg2.jpg';
screens[2]['columns'] = [3,4]

screens[3] = {
    background: 'bg2.jpg',
    columns: []
}
