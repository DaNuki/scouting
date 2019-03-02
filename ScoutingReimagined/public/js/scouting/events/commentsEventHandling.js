function Comment() {
    return {
        "teamNumber": teamNumber,
        "gameId": gameId,
        "startTime": Math.round(gameVideo.currentTime - autonomousStartTime), // videoCurrentTime,
        "endTime": Math.round(gameVideo.currentTime - autonomousStartTime), // videoCurrentTime,
        "eventName": "comment",
        "timeTook":0,
        "content": null,
        "competition": competition
    }
}

var comment = null;

function comment_start() {
    comment = Comment();
    hideAllButtons();
    comment_text();
}

function comment_text() {
    fillEventsDivWithObjects([
        {
            type: 'text',
            value: 'Comment'
        }
    ], comment_finish);
}

function comment_finish(text) {
	comment.content = text;
    sendEvent(comment);

    initializeEvents();

}