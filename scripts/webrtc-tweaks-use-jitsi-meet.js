class WebRTCTweaksCameraViews extends CameraViews {
    constructor(webrtc, options) {
        super(webrtc, options);

        // Set base application so renderCameraViews hooks will be called
        this.options.baseApplication = "CameraViews";
    }

    render(force, context={}) {
        if (game.settings.get("webrtc-tweaks", "useJitsiMeet")) {
            console.log("WebRTCTweaks: useJitsiMeet set, not rendering CameraViews");
            return;
        }
        return super.render(force, context);
    }
}

class WebRTCTweaksJitsiClient extends JitsiRTCClient {
    async initialize() {
        if (game.settings.get("webrtc-tweaks", "useJitsiMeet")) {
            console.log("WebRTCTweaks: useJitsiMeet set, not initializing WebRTC");
            return true;
        }
        return super.initialize();
    }

    async connect({ host, room, username, password } = {}) {
        if (game.settings.get("webrtc-tweaks", "useJitsiMeet")) {
            console.log("WebRTCTweaks: useJitsiMeet set, not connecting to WebRTC");
            return true;
        }
        return super.connect({ host, room, username, password });
    }

    static sendJoinMessage() {
        let serverUrl = game.webrtc.client._options.hosts.domain;
        let roomId = game.webrtc.settings.getWorldSetting("server.room");
        let userId = game.userId;

        let url = "https://" + serverUrl + "/" + roomId + "#userInfo.displayName=%22" + userId + "%22";

        let chatData = {
            content: "<a href=" + url + ">Join Jitsi Meeting</a>",
            speaker: {scene: null, actor: null, token: null, alias: "WebRTC Tweaks"},
            whisper: [game.userId]
        };
        ChatMessage.create(chatData, {});
    }

    static jitsirtcActive = false;
}

Hooks.on("init", () => {
    if (game.modules.get("jitsirtc") && game.modules.get("jitsirtc").active) {
        WebRTCTweaksJitsiClient.jitsirtcActive = true;
    }

    game.settings.register("webrtc-tweaks", "useJitsiMeet", {
        name: "Use full Jitsi Meet client",
        hint: "Use the full Jitsi Meet web interface instead of the built-in audio/video display",
        scope: "client",
        config: WebRTCTweaksJitsiClient.jitsirtcActive,
        default: false,
        type: Boolean,
        onChange: () => window.location.reload()
    });

    if (WebRTCTweaksJitsiClient.jitsirtcActive) {
        CONFIG["ui"].webrtc = WebRTCTweaksCameraViews;
        CONFIG["WebRTC"].clientClass = WebRTCTweaksJitsiClient;
    }
});

Hooks.on('ready', () => {
    if (WebRTCTweaksJitsiClient.jitsirtcActive && game.settings.get("webrtc-tweaks", "useJitsiMeet")) {
        WebRTCTweaksJitsiClient.sendJoinMessage();
    }
});