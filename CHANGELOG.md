# v0.6.0

- Convert to typescript
- Update dependencies
- Update for FVTT v9.231 compatibility
- Format markdown documents

# v0.5.9

- Minor refactor for more consistency
- Update compatible FVTT version to v0.8.8

# v0.5.8

- Minor refactor for more consistency
- Update compatible FVTT version to v0.8.6

# v0.5.7

- Fix github workflow for packaging of language files

# v0.5.6

- Switch to esmodule format for easier maintenance
- Update compatibility to FVTT v0.8.5

# v0.5.5

- Update compatibility to FVTT v0.8.1

# v0.5.4

- Update manifest+ entries

# v0.5.3

- Update compatibility to FVTT v0.8.0

# v0.5.2

- Update compatibility to FVTT v0.7.9
- Update workflow to include git hash in release message

# v0.5.1

- Update compatibility to FVTT v0.7.8
- Add GitHub Action workflow for automated release
- Change default branch to "main"

# v0.5.0

- Update compatibility to FVTT v0.7.6
- Remove support for versions less than FVTT v0.7.2
- Remove the "Use full Jitsi Meet client" option as it has been ported to the main JitsiWebRTC module

# v0.4.1

- Update compatibility to FVTT v0.7.1
- Update to support Jitsi WebRTC Client v0.3.0

# v0.4.0

- Update compatibility to FVTT v0.7.0
- Move the Change Position to the left bar so it is always visible and to de-clutter the bottom navigation bar. Fixes: [Issue #6](https://github.com/bekriebel/fvtt-module-webrtc_tweaks/issues/6)

# v0.3.4

- Update compatibility to FVTT v0.6.4
- Fix href url quoting

# v0.3.3

- Update compatibility to FVTT v0.6.2
- Format and fix code with ESLint

# v0.3.2

- Update compatibility to FVTT v0.6.1
- Pull server URL from the webrtc options for consistency

# v0.3.1

- Fix server variable error when using default Jitsi server

# v0.3.0

- Update compatibility to FVTT v0.6.0
- Fix the way I was handling hooks to properly call original renderCameraViews hook
- Switch to controlling cameraview position & size with javascript to make it so we can adapt the the interface better and fix the overflow that was occuring in a vertical layout

# v0.2.0

- Add ability to join video call with full Jitsi Meet interface
- Minor adjustment to video location CSS
- Update compatibility to FVTT v0.5.7

# v0.1.0

- Initial public release. Ability to change video location.
