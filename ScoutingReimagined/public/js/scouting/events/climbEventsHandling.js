function Climb() {
    return {
        "teamNumber": teamNumber,
        "gameId": gameId,
        "eventName": "climb",
        "startTime": Math.round(gameVideo.currentTime - autonomousStartTime), // videoCurrentTime,
        "matchPart": (gameVideo.currentTime - autonomousStartTime) < 15 ? "autonomous" : "teleop",
        "endTime": null,
        "level": -1,
        "timeTook": null,
        "status": null, // Can be: "success" || "fail"
        "failReason": null, // Can be: TODO: add fail reasons codes for shooting events
        "competition": competition
    }
}

var climb = null;

function climb_start() {
    climb = Climb();
    hideAllButtons();
    climb_level();
}
function climb_level() {
    if (climb.matchPart == "autonomous") {
        fillEventsDivWithObjects([{
            type: 'button',
            value: 1
        },
        {
            type: 'button',
            value: 2
        }
        ], climb_status);
    } else {
        fillEventsDivWithObjects([{
            type: 'button',
            value: 1
        },
        {
            type: 'button',
            value: 2
        },
        {
            type: 'button',
            value: 3
        }
        ], climb_status);
    }
}
function climb_status(level) {
    climb.level = level;
    fillEventsDivWithObjects([{
        type: 'button',
        value: 'Success'
    },
    {
        type: 'buttonSelect',
        value: ['Failed because of interruption', 'Falied because of falling', 'Failed because of mechanical failure', 'Failed because game ended']
    }
    ], climb_finish);
}

function climb_finish(climb_status) {
    climb.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
    if (climb_status === 'Success') {
        climb.status = climb_status;
        delete climb.failReason; // Prevent ElasticSearch from indexing this value
    } else {
        climb.status = 'Failure';
        climb.failReason = climb_status;
    }
    sendEvent(climb);

    initializeEvents();

}
