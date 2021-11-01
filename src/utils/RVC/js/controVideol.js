export function OpenVideo(video, vehicleId, channel, vehiclelicense, deviceno, platecolor, streamtype) {
    console.log('wfs', wfs)
    var wfs = null
    if (wfs !== null) {
        return;
    }
    console.log('wfs 2', new Wfs())

    var MSGID = 0XF003;
    wfs = new Wfs()
    var wfsObj = {
        PLATECOLOR: platecolor,
        DEVICETYPE: 0xD000,
        VEHICLEID: vehicleId,
        CHANNEL: channel,
        VEHICLELICENSE: vehiclelicense,
        DEVICENO: deviceno,
        STREAMTYPE: streamtype,
        DATATYPE: 0,
        RECORDFLAG: 0
    }, player = new PCMPlayer({
        encoding: "16bitInt",
        channels: 1,
        sampleRate: 8000,
        flushingTime: 1000
    });
    console.log('OpenVideo', wfsObj)
    video.poster = "img/timg.gif";
    wfs.attachMedia(video, [wfsObj, player]);
}

export function CloseVideo(wfsObj, vehicleId, channel, vehiclelicense, deviceno, platecolor) {
    if (wfsObj === null) {
        return;
    }
    MSGID = 0XF004;
    var closeObj = {
        VEHICLEID: vehicleId,
        VEHICLELICENSE: vehiclelicense,
        PLATECOLOR: platecolor,
        DEVICENO: deviceno,
        DEVICETYPE: 0xD000,
        CHANNEL: channel,
        CTRLFLAG: 0,
        STOP: 0,
        SWICH: 1
    }
    wfsObj.websocketLoader.client.send(JSON.stringify({ HEAD: { MSGID: MSGID, USERID: userId, TRANSNO: 0 }, PARAM: closeObj }));
    wfsObj.media.poster = "img/video.png";
    wfsObj.media.src = "";
    wfsObj.websocketLoader.client.close();
}

export function OnAudio(obj) {
    if (obj === null) {
        return;
    }
    obj.switchStream = true;
}

export function OffAudio(obj) {
    if (obj === null) {
        return;
    }
    obj.switchStream = false;
}

export function DeviceFileList(vehicleId, vehiclelicense, platecolor, deviceno, channel, startTime, endTime) {
    var wfsObj = {
        VEHICLEID: vehicleId,
        VEHICLELICENSE: vehiclelicense,
        PLATECOLOR: platecolor,
        DEVICENO: deviceno,
        DEVICETYPE: 0xD000,
        RECORDTYPE: 0,
        DATATYPE: 0,
        ALARMTYPE: 0,
        CHANNEL: channel,
        STORAGE: 1,
        STARTTIME: startTime,
        ENDTIME: endTime
    };
    websocket.send(JSON.stringify({ HEAD: { MSGID: 0xF005, USERID: userId, TRANSNO: 0 }, PARAM: wfsObj }));
}

export function ServiceFileList(vehicleId, vehiclelicense, platecolor, deviceno, channel, startTime, endTime) {
    var wfsObj = {
        VEHICLEID: vehicleId,
        VEHICLELICENSE: vehiclelicense,
        PLATECOLOR: platecolor,
        DEVICENO: deviceno,
        DEVICETYPE: 0xD000,
        CHANNEL: channel,
        STARTTIME: startTime,
        ENDTIME: endTime
    };
    websocket.send(JSON.stringify({ HEAD: { MSGID: 0xF00B, USERID: userId, TRANSNO: 0 }, PARAM: wfsObj }));
}

export function OpenRecordingVideo(video, vehicleId, vehiclelicense, platecolor, deviceno, channel, startTime, endTime) {
    MSGID = 0xF006;
    wfs = new Wfs(),
        wfsObj = {
            VEHICLEID: vehicleId,
            VEHICLELICENSE: vehiclelicense,
            PLATECOLOR: platecolor,
            DEVICENO: deviceno,
            DEVICETYPE: 0xD000,
            DOWNLOAD: 0,
            CHANNEL: channel,
            STORAGE: 0,
            VIDEOTYPE: 0,
            STREAMTYPE: 2,
            PLAYBACKTYPE: 0,
            MULTIPLE: 0,
            STARTTIME: startTime,
            ENDTIME: endTime
        }, player = new PCMPlayer({
            encoding: "16bitInt",
            channels: 1,
            sampleRate: 8000,
            flushingTime: 1000
        });
    video.poster = "../img.gif";
    wfs.attachMedia(video, [wfsObj, player]);
}

export function OpenServiceVideo(video, sUrl) {
    MSGID = 0xF00C;
    wfs = new Wfs();
    var wfsObj = {
        FILEPATH: sUrl
    }, player = new PCMPlayer({
        encoding: "16bitInt",
        channels: 1,
        sampleRate: 8000,
        flushingTime: 1000
    });
    video.poster = "img/timg.gif";
    wfs.attachMedia(video, [wfsObj, player]);
}

export function DownloadVideoCenter(vehicleId, vehiclelicense, platecolor, deviceno, channel, startTime, endTime) {
    var wfsObj = {
        VEHICLEID: vehicleId,
        VEHICLELICENSE: vehiclelicense,
        PLATECOLOR: platecolor,
        DEVICENO: deviceno,
        DEVICETYPE: 0xD000,
        RECORDTYPE: 0,
        DATATYPE: 2,
        ALARMTYPE: 0,
        CHANNEL: channel,
        STORAGE: 1,
        STARTTIME: startTime,
        ENDTIME: endTime,
        EXECUTEON: 0
    };
    websocket.send(JSON.stringify({ HEAD: { MSGID: 0xF00A, USERID: userId, TRANSNO: 0 }, PARAM: wfsObj }));
}

export function CaptureVideo(video) {
    var imgHeight = 0,
        imgWidth = 0,
        videoWidth = 0,
        videoHeight = 0,
        canvas = null,
        canvasCtx = null;
    canvas = document.createElement("canvas");
    canvasCtx = canvas.getContext("2d");
    canvas.width = imgWidth = video.offsetWidth;
    canvas.height = imgHeight = video.offsetHeight;
    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    canvasCtx.drawImage(video, 0, 0, videoWidth, videoHeight, 0, 0, imgWidth, imgHeight);
    var imgUrl = canvas.toDataURL("image/png");
    var a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.setAttribute("href", imgUrl);
    a.setAttribute("download", "视频截图.png");
    a.click();
    document.body.removeChild(a);
}

var websocketH5Monitor = null;
export function OpenH5Monitor(vehicleId, vehiclelicense, deviceno, plateColor) {
    var H5Monitorplayer = new PCMPlayer({
        encoding: "16bitInt",
        channels: 1,
        sampleRate: 8000,
        flushingTime: 1000
    });
    var wfsObj = {
        PLATECOLOR: plateColor,
        DEVICETYPE: 0xD000,
        VEHICLEID: vehicleId,
        CHANNEL: 1,
        VEHICLELICENSE: vehiclelicense,
        DEVICENO: deviceno,
        STREAMTYPE: 1,
        DATATYPE: 3,
        RECORDFLAG: 0
    };
    websocketH5Monitor = new WebSocket('ws://' + websocketIP);
    websocketH5Monitor.onopen = function () {
        websocketH5Monitor.send(JSON.stringify({ HEAD: { MSGID: 0xF003, USERID: userId, TRANSNO: 0 }, PARAM: wfsObj }));
    };
    websocketH5Monitor.onmessage = function (event) {
        if (event.data.size === 640) {
            var blob = event.data;
            var reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onload = function (e) {
                var buf = new Uint8Array(reader.result);
                H5Monitorplayer.feed(buf);
            }
        }
    }
}

export function CloseH5Monitor(vehicleId, vehiclelicense, deviceno, plateColor) {
    if (websocketH5Monitor === null) {
        return;
    }
    var closeObj = {
        VEHICLEID: vehicleId,
        VEHICLELICENSE: vehiclelicense,
        PLATECOLOR: plateColor,
        DEVICENO: deviceno,
        DEVICETYPE: 0xD000,
        CHANNEL: 1,
        CTRLFLAG: 4,
        STOP: 0,
        SWICH: 1
    };
    websocketH5Monitor.send(JSON.stringify({ HEAD: { MSGID: 0XF004, USERID: userId, TRANSNO: 0 }, PARAM: closeObj }));
    websocketH5Monitor.close();
    websocketH5Monitor = null
}

export function TurnOnIntercom(vehicleId, vehiclelicense, deviceno, plateColor) {
    WebRecord.get(function (rec) {
        gRecorder = rec;
    })
    var wfsObj = {
        PLATECOLOR: plateColor,
        DEVICETYPE: 0xD000,
        VEHICLEID: vehicleId,
        CHANNEL: 13,
        VEHICLELICENSE: vehiclelicense,
        DEVICENO: deviceno,
        STREAMTYPE: 1,
        DATATYPE: 2,
        RECORDFLAG: 0
    };
    var H5Monitorplayer = new PCMPlayer({
        encoding: "16bitInt",
        channels: 1,
        sampleRate: 8000,
        flushingTime: 1000
    });
    // if (!navigator.getUserMedia) {
    //     return false;
    // }
    console.log(gRecorder);
    if (gRecorder === null) {
        alert("未检测到录音设备");
        return;
    }
    gRecorderWebSocket = new WebSocket('ws://' + websocketIP);

    gRecorderWebSocket.onopen = function () {
        console.log(gRecorder)
        gRecorder.start();
        gRecorderWebSocket.send(JSON.stringify({ HEAD: { MSGID: 0xF003, USERID: userId, TRANSNO: 0 }, PARAM: wfsObj }));
    };
    gRecorderWebSocket.onmessage = function (event) {
        if (event.data.size === 640) {
            var blob = event.data;
            var reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            //bolb流转为ArrayBuffer
            reader.onload = function (e) {
                //console.info(reader.result);
                var buf = new Uint8Array(reader.result);
                H5Monitorplayer.feed(buf);
            }
        }
    }
}

export function TurnOffIntercom(vehicleId, vehiclelicense, deviceno, plateColor) {
    var closeObj = {
        VEHICLEID: vehicleId,
        VEHICLELICENSE: vehiclelicense,
        PLATECOLOR: plateColor,
        DEVICENO: deviceno,
        DEVICETYPE: 0xD000,
        CHANNEL: 13,
        CTRLFLAG: 0,
        STOP: 0,
        SWICH: 1
    };
    gRecorder.stop();
    gRecorderWebSocket.send(JSON.stringify({ HEAD: { MSGID: 0XF004, USERID: userId, TRANSNO: 0 }, PARAM: closeObj }));
    gRecorderWebSocket.close();
}