function Cycle() {
    return {
        "teamNumber": teamNumber,
        "gameId": gameId,
        "eventName": "cycle",
        "startTime": Math.round(gameVideo.currentTime - autonomousStartTime),// videoCurrentTime,
        "matchPart": (gameVideo.currentTime - autonomousStartTime) < 15 ? "autonomous" : "teleop",
        "endTime": null,
        "status": null, // Can be: "success" || "fail"
        "failReason": null, // Can be: TODO: add fail reasons codes for shooting events
        "pickup": null,
        "place": null,
        "competition": competition
    }
}

var cycle = pickup || Cycle();

function pickup_start() {
    cycle = Cycle();
    hideAllButtons();
    pickup_type();
}

function start_cycle(){
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'start pickup'
        }
    ], pickup_start)
}


function pickup_start(placeholder) {
    cycle.pickup = PickUp();
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
    cycle.pickup.type = pickup_type;
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
    cycle.pickup.location = pickup_location;
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
    cycle.pickup.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
    if (cyclepickup_status === 'Success') {
        cycle.pickup.status = pickup_status;
        delete cycle.pickup.failReason;  // Prevent ElasticSearch from indexing this value
    } else {
        cycle.pickup.status = 'Failure';
        cycle.pickup.failReason = pickup_status;
        delete cycle.place;
        finish_cycle();
        return;
    }
    
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Place Start'
        }
    ], placeit_start)

}

function placeit_start(sdf){
    cycle.place = Place();
    hideAllButtons();
    place_what();
}

function place_what(){
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Hatch Panel'
        },
        {
            type: 'button',
            value: 'Cargo'
        }

    ],place_location);
}

function place_location(type) {
    cycle.place.type=type;	
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Left Rocket'
        },
        {
            type: 'button',
            value: 'Right Rocket'
        },
	{
	    type:'button',
	    value: 'Cargo Airship'
	}
    ],place_level);
}
function place_level(location){
    if(location=='Cargo Airship'){
       return place_status(1);
    }
    fillEventsDivWithObjects([
	{
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

    ],place_status)
}
function place_status(level){
    cycle.place.level=level;
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Success'
        },
        {
            type:'buttonSelect',
            value: ['Failed because of interruption', 'Failed because of mechanical failure','failed because it fell']
        }
    ], place_finish)
}


function place_finish(status) {
    cycle.place.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
    if (status === 'Success') {
        cycle.place.status=status;
        delete cycle.place.failReason; // Prevent ElasticSearch from indexing this value
    } else {
        cycle.place.status = 'Failure';
        cycle.place.failReason = status;
    }

}

function finish_cycle(){
    cycle.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
    if (cycle.pickup.status === 'Success' && cycle.place.status === 'Success'){
        cycle.status = 'Success';
        delete cycle.failReason;
    }
    else if (cycle.pickup.status === 'Success' && !(cycle.place.status === 'Success')){
        cycle.status = 'Failure'
        cycle.failReason = cycle
    }
    sendEvent(cycle);
    initializeEvents();
}

