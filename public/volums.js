var gRecorder = null;
var gRecorderWebSocket = null;
(function () {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    WebRecord = function (l) {
        config = {};
        config.sampleBits = config.smapleBits || 16;
        config.sampleRate = config.sampleRate || (8000);
        var b = new AudioContext();
        var a = b.createMediaStreamSource(l);
        var m = b.createScriptProcessor(1024, 1, 1);
        var n = 0;
        var f = [];
        var d = b.sampleRate;
        var j = 16;
        var i = config.sampleRate;
        var g = config.sampleBits;

        function h() {
            f = [];
            n = 0
        }

        function k(o) {
            //console.log(new Float32Array(o));
            f.push(new Float32Array(o));
            n += o.length;
            //console.log(f.length);
            if (f.length === 4) {
                gRecorderWebSocket.binaryData = "blob";
                gRecorderWebSocket.send(gRecorder.getBlob());
                //console.log(gRecorder.getBlob())
                f = [];
                n = 0;
            }
        }

        function e() {
            var u = new Float32Array(n);
            var v = 0;
            for (var s = 0; s < f.length; s++) {
                u.set(f[s], v);
                v += f[s].length
            }
            var p = parseInt(d / i);
            var t = u.length / p;
            var o = new Float32Array(t);
            var r = 0, q = 0;
            while (r < t) {
                o[r] = u[q];
                q += p;
                r++
            }
            return o
        }

        function c() {
            var y = Math.min(d, i);
            var o = Math.min(j, g);
            var A = e();
            var p = A.length * (o / 8);
            var u = new ArrayBuffer(44 + p);
            var w = new DataView(u);
            var r = 1;
            var t = 0;
            var x = function (B) {
                for (var s = 0; s < B.length; s++) {
                    w.setUint8(t + s, B.charCodeAt(s))
                }
            };
            x("RIFF");
            t += 4;
            w.setUint32(t, 36 + p, true);
            t += 4;
            x("WAVE");
            t += 4;
            x("fmt ");
            t += 4;
            w.setUint32(t, 16, true);
            t += 4;
            w.setUint16(t, 1, true);
            t += 2;
            w.setUint16(t, r, true);
            t += 2;
            w.setUint32(t, y, true);
            t += 4;
            w.setUint32(t, r * y * (o / 8), true);
            t += 4;
            w.setUint16(t, r * (o / 8), true);
            t += 2;
            w.setUint16(t, o, true);
            t += 2;
            x("data");
            t += 4;
            w.setUint32(t, p, true);
            t += 4;
            if (o === 8) {
                for (var v = 0; v < A.length; v++, t++) {
                    var z = Math.max(-1, Math.min(1, A[v]));
                    var q = z < 0 ? z * 32768 : z * 32767;
                    q = parseInt(255 / (65535 / (q + 32768)));
                    w.setInt8(t, q, true)
                }
            } else {
                for (var v = 0; v < A.length; v++, t += 2) {
                    var z = Math.max(-1, Math.min(1, A[v]));
                    w.setInt16(t, z < 0 ? z * 32768 : z * 32767, true)
                }
            }
            //console.log(w);
            return new Blob([w], {type: "audio/wav"})
        }

        this.start = function () {
            a.connect(m);
            m.connect(b.destination)
        };
        this.stop = function () {
            gRecorder = null
            m.disconnect()
        };
        this.getBlob = function () {
            return c()
        };
        this.clear = function () {
            h()
        };
        m.onaudioprocess = function (o) {
            if(gRecorder !== null){
                k(o.inputBuffer.getChannelData(0))
            }
        }
    };
    WebRecord.get = function (a) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        console.log(!navigator.getUserMedia);
        if (!navigator.getUserMedia) {
            alert("系统未检测到录音设备，请接入")
        }
        if (a) {
            if (navigator.getUserMedia) {
                navigator.getUserMedia({audio: true}, function (c) {
                    var b = new WebRecord(c);
                    a(b)
                }, function () {
                })
            }
        }
    }
})();