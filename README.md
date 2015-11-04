# spacelink

**a virtual room that bridges long distances**

![Spacelink](http://joel-github-static.s3.amazonaws.com/spacelink/spacelink.png)

## Technologies

- <http://threejs.org>
- <http://simplewebrtc.com>
- <http://github.com/256dpi/depthstream>
- <http://mozvr.com>
- <https://github.com/borismus/webvr-boilerplate>
- <https://github.com/pieroxy/lz-string>

## Installation

1. Download the latest Firefox Nightly build: <http://nightly.mozilla.org>.
2. Install the WebVR Enabler Add-On: <https://addons.mozilla.org/en-US/firefox/addon/mozilla-webvr-enabler>.
3. Install depthstream and dependencies from: <https://github.com/256dpi/depthstream/releases>.
4. Start a local depthstream server: `depthstream -r 4 -c -I 1`.
5. Put the Sensor 3m in front of you and 1.6m above floor level.
6. Load Spacelink in your browser.

## Controls

Use the following controls to interact with the system:
 
- `d`: Show debug informations like coordinates and measurements.
- `enter`: Enable or disable rendering.
- `v`: Enable or disable VR mode.
- `space`: Reset Oculus position. (Do this while standing exactly 3m in front of the sensor.)
- `dblclick`: Go fullscreen and enable VR barrel distortion.
