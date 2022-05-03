// when the page has loaded
window.addEventListener('load', function () {
  // tracking chosen device source
  let selectedDeviceId;

  // init code reader
  const codeReader = new ZXing.BrowserMultiFormatReader();

  // code reader usage
  codeReader
    .listVideoInputDevices() // get camera sources
    .then((videoInputDevices) => {
      // target camera sources selection input
      const sourceSelect = document.getElementById('sourceSelect');

      // get id of the selected camera source
      selectedDeviceId = videoInputDevices[0].deviceId;

      // if there is more than 1 camera sources, add option in selection input
      if (videoInputDevices.length >= 1) {
        videoInputDevices.forEach((element) => {
          const sourceOption = document.createElement('option');
          sourceOption.text = element.label;
          sourceOption.value = element.deviceId;
          sourceSelect.appendChild(sourceOption);
        });

        // if user changes camera source, update chosen id
        sourceSelect.onchange = () => {
          selectedDeviceId = sourceSelect.value;
        };

        // change canvas display when a video source has been selected
        const sourceSelectPanel = document.getElementById('sourceSelectPanel');
        sourceSelectPanel.style.display = 'block';
      }

      // start button handling
      document.getElementById('startButton').addEventListener('click', () => {
        // use video source to start detect and decode optical input
        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          'video',
          (result, err) => {
            if (result) {
              console.log(result);

              // update result display
              document.getElementById('result').textContent = result.text;
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
              console.error(err);

              // update result display with error if there is
              document.getElementById('result').textContent = err;
            }
          }
        );
      });

      // reset button handling
      document.getElementById('resetButton').addEventListener('click', () => {
        // reset all code reader config
        codeReader.reset();

        // empty result
        document.getElementById('result').textContent = '';
      });
    })
    .catch((err) => {
      console.error(err);
    });
});
