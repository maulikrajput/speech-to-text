var tspSocket = (function () {
    return {
        grantPermission: function (lang) {
            grantPermissionF(lang);
        },
        stopRecording: function () {
            stopRecordingF();
        },
        sendText: function () {
            sendRecording();
        }
    }
})(tspSocket || {})

var recognizing;

function reset() {
    recognizing = false;
    speech.start();
}

var speech = new webkitSpeechRecognition() || speechRecognition();
speech.continuous = false;
speech.interimResults = true;

function grantPermissionF(lang) {
    try {
        speech.lang = lang;
        speech.start();
    } catch (error) {
        reset();
    }
};

function stopRecordingF() {
    recognizing = false;
    speech.stop();
};

function sendRecording() {
    // send 'to_send_transcript' to API/ Backend
    to_send_transcript = '';
}

speech.onstart = function () {
    // When recognition begins
    recognizing = true;
};

var to_send_transcript = '';
speech.onresult = function (event) {

    // When recognition produces result
    var interim_transcript = '';
    var final_transcript = '';

    // main for loop for final and interim results
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
            document.getElementById('interVoiceText').innerText = '';
            to_send_transcript += ' ' + final_transcript;

            if (document.getElementById('finalVoiceText').innerText.length >= 300) {
                document.getElementById('finalVoiceText').innerText = final_transcript + ' ';
                
                sendRecording(final_transcript); // send stream of speech to API/ backend (optional)
            }
            else {
                document.getElementById('finalVoiceText').innerText += final_transcript + ' ';
            }
        } else {
            interim_transcript += event.results[i][0].transcript;
            document.getElementById('interVoiceText').innerText = interim_transcript
        }
    }
};

speech.onerror = function (event) {
    // Either 'No-speech' or 'Network connection error'
    speech.stop();
};

speech.onend = function () {
    // When recognition ends
    if (recognizing) {
        reset();
    }
};