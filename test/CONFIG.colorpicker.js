config['app_title'] = 'colorpicker';
config['domoticz_refresh'] = '5000';
config['dashticz_refresh'] = '600';
config['enable_websocket'] = false;

console.log('COnfig 2');

var testVectors = {
    colorpicker1 : {
        "ActTime" : 1604740178,
        "AstrTwilightEnd" : "18:59",
        "AstrTwilightStart" : "05:53",
        "CivTwilightEnd" : "17:40",
        "CivTwilightStart" : "07:12",
        "DayLength" : "09:15",
        "NautTwilightEnd" : "18:20",
        "NautTwilightStart" : "06:32",
        "ServerTime" : "2020-11-07 10:09:38",
        "SunAtSouth" : "12:26",
        "Sunrise" : "07:49",
        "Sunset" : "17:04",
        "app_version" : "2020.2 (build 12501)",
        "result" :
        [
        {
        "AddjMulti" : 1.0,
        "AddjMulti2" : 1.0,
        "AddjValue" : 0.0,
        "AddjValue2" : 0.0,
        "BatteryLevel" : 255,
        "Color" : "{\"b\":0,\"cw\":70,\"g\":0,\"m\":2,\"r\":0,\"t\":185,\"ww\":185}",
        "CustomImage" : 0,
        "Data" : "Off",
        "Description" : "",
        "DimmerType" : "abs",
        "Favorite" : 0,
        "HardwareID" : 8,
        "HardwareName" : "Philips Hue",
        "HardwareType" : "Philips Hue Bridge",
        "HardwareTypeVal" : 38,
        "HaveDimmer" : true,
        "HaveGroupCmd" : false,
        "HaveTimeout" : false,
        "ID" : "1",
        "Image" : "Light",
        "IsSubDevice" : false,
        "LastUpdate" : "2020-11-06 23:18:25",
        "Level" : 51,
        "LevelInt" : 51,
        "MaxDimLevel" : 100,
        "Name" : "Lamp Staand TV Hue",
        "Notifications" : "false",
        "PlanID" : "0",
        "PlanIDs" :
        [
        0
        ],
        "Protected" : false,
        "ShowNotifications" : true,
        "SignalLevel" : "-",
        "Status" : "Off",
        "StrParam1" : "",
        "StrParam2" : "",
        "SubType" : "WW",
        "SwitchType" : "Dimmer",
        "SwitchTypeVal" : 7,
        "Timers" : "false",
        "Type" : "Color Switch",
        "TypeImg" : "dimmer",
        "Unit" : 1,
        "Used" : 1,
        "UsedByCamera" : false,
        "XOffset" : "0",
        "YOffset" : "0",
        "idx" : "1081"
        }
        ],
        "status" : "OK",
        "title" : "Devices"
        }
}
var blocks = {
}

blocks[1081] = {
    colorpicker: 2
}

var columns = {}

columns[1] = {}
columns[1]['blocks'] = [
    'sunrise', 1081
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
