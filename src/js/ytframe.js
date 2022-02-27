let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-player', {
        height: '405',
        width: '660',
        videoId: 'lbyOe4qD7EA',
        events: {
            // 'onReady': onPlayerReady,
            // 'onStateChange': onPlayerStateChange
        }
    });
}