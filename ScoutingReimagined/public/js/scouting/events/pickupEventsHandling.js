function PickUp() {
    return {
        "teamNumber": teamNumber,
        "gameId": gameId,
        "eventName": "pickup",
        "type": null,
        "startTime": Math.round(gameVideo.currentTime - autonomousStartTime),// videoCurrentTime,
        "matchPart": (gameVideo.currentTime - autonomousStartTime) < 15 ? "autonomous" : "teleop",
        "endTime": null,
        "location": null, // Can be: "floor" || "feeder"
        "status": null, // Can be: "success" || "fail"
        "failReason": null, // Can be: TODO: add fail reasons codes for shooting events
        "competition": competition
    }
}

var pickup = pickup || PickUp();

function pickup_start() {
    pickup = PickUp();
    hideAllButtons();
    pickup_type();
}

function pickup_type() {
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Hatch Panel'
        },
        {
            type: 'button',
            value: 'Cargo'
        }
    ], pickup_location);
}

function pickup_location(pickup_type) {
    pickup.type = pickup_type;
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Floor'
        },
        {
            type: 'button',
            value: 'Feeder'
        }
    ], pickup_status);
}

function pickup_status(pickup_location) {
    pickup.location = pickup_location;
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Success'
        },
        {
            type:'buttonSelect',
            value: ['Failed because of interruption', 'Failed because of mechanical failure']
        }
    ], pickup_finish);
}

function pickup_finish(pickup_status) {
    pickup.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
    if (pickup_status === 'Success') {
        pickup.status = pickup_status;
        delete pickup.failReason;  // Prevent ElasticSearch from indexing this value
    } else {
        pickup.status = 'Failure';
        pickup.failReason = pickup_status;
    }
    sendEvent(pickup);

    initializeEvents();

}
