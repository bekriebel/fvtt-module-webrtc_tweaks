# WebRTC Tweaks
Improvements for the WebRTC (including [JitsiWebRTC](https://github.com/luvolondon/fvtt-module-jitsiwebrtc/)) video conferencing system for FVTT.

* Add position button to move all of video windows to different sides of the screen (left vertical, top horizonal, right vertical, and original bottom horizontal)
* Add a Module Setting to use the full Jitsi Meet interface in place of the built-in video display when using the JitsiWebRTC module

## Installation
You can install this module by using the following manifest URL: https://raw.githubusercontent.com/bekriebel/fvtt-module-webrtc_tweaks/master/module.json

## How to use
### **Video Position**
Select the position button in the video control bar to cycle through the various position layouts.

![position button example](https://raw.githubusercontent.com/bekriebel/fvtt-module-webrtc_tweaks/master/images/example_position.png)

### **Use Jitsi Meet Client**
   1. Under Module Settings, turn on the option `Use Full Jitsi Meet Client`. *Note: This is a client setting that is configured per-user.*

![module settings example](https://raw.githubusercontent.com/bekriebel/fvtt-module-webrtc_tweaks/master/images/example_useJitsiMeet.png)

   2. With the option enabled, the normal camera views will be disabled and a message will be displayed in the chat log with a link to `Join Jitsi Meeting`.

![join meeting chat message example](https://raw.githubusercontent.com/bekriebel/fvtt-module-webrtc_tweaks/master/images/example_joinJitsiMeeting.png)

   3. The user(s) signed into the Jitsi Meeting will see any users using the normal camera views and vice versa.

*Notes*:
* Users signed in to the Jitsi Meeting should not change their Display Name in the Jitsi Meet interface as this will break the connection to FVTT's camera views.
* `Blocker User Video` and `Block User Audio` options do not work on users who are signed in to the Jitsi Meet interface.

## Known issues
* [Cameras overflow column in vertical position](https://github.com/bekriebel/fvtt-module-webrtc_tweaks/issues/2)

## Changelog
* v0.2.0
  * Add ability to join video call with full Jitsi Meet interface
  * Minor adjustment to video location CSS
  * Update compatibility to FVTT v0.5.7
* v0.1.0 - Initial public release. Ability to change video location.
