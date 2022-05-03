qrcode = window.qrcode;

const video = document.createElement('video');
const canvasElement = document.getElementById('qr-canvas');
const canvas = canvasElement.getContext('2d');

const qrResult = document.getElementById('qr-result');
const outputData = document.getElementById('outputData');
const btnScanQR = document.getElementById('btn-scan-qr');

let scanning = false;

qrcode.callback = (res) => {
    if (res) {
        scanning = false;
        outputData.innerText = res;
        video.srcObject.getTracks().forEach((track) => {
            track.stop();
        });

        // show other elements rather than the video canvas
        qrResult.hidden = false;
        canvasElement.hidden = true;
        btnScanQR.hidden = false;

        // open response url (scanned url resulted from the QR code) in the current window
        // window.open(res,"_self")

        // print out the resutlt url when scanned successfully
        console.log(res);
    }
};

/**
 * Handle scan QR Code button click event
*/
btnScanQR.onclick = () => {
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then(function (stream) {
            scanning = true;

            // hide other elements rather than video canvas
            qrResult.hidden = true;
            btnScanQR.hidden = true;
            canvasElement.hidden = false;

            // IMPORTANT: required to tell iOS safari we don't want fullscreen a.k.a open the Boardcast Screen
            video.setAttribute('playsinline', 'playsinline');
            video.setAttribute('webkit-playsinline', 'webkit-playsinline');
            
            video.srcObject = stream;
            video.play();

            // draw the video canvas and start displaying the device's camera
            tick();

            // start scanning for QR code
            scan();
        });
};

/**
 * Method to draw canvas element for video display
 */
function tick() {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    scanning && requestAnimationFrame(tick);
}

/**
 * Method to decode QR Code when detected by camera
 */
function scan() {
    try {
        qrcode.decode();
    } catch (e) {
        setTimeout(scan, 300);
    }
}
