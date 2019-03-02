function Cycle() {
    return {
        "teamNumber": teamNumber,
        "gameId": gameId,
        "eventName": "cycle",
        "startTime": Math.round(gameVideo.currentTime - autonomousStartTime),// videoCurrentTime,
        "matchPart": (gameVideo.currentTime - autonomousStartTime) < 15 ? "autonomous" : "teleop",
        "endTime": 0,
        "status": null, // Can be: "success" || "fail"
        "failReason": null,
        "pickup": null,
        "place": null,
        "timeTook":0,
        "competition": competition
    }
}

var cycle = Cycle();

// function pickup_start() {
//     cycle = Cycle();
//     hideAllButtons();
//     pickup_type();
// }

function start_cycle() {
    hideAllButtons();
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'start pickup'
        }
    ], pickup_start)
}
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

function pickup_start(iscycle) {
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
            type: 'buttonSelect',
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
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Start Place'
        },
        {
            type: 'button',
            value: 'Stop Cycle'
        }
    ], placeit_start)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Place() {
    return {
        "teamNumber": teamNumber,
        "gameId": gameId,
        "eventName": "place",
        "startTime": Math.round(gameVideo.currentTime - autonomousStartTime),// videoCurrentTime,
        "matchPart": (gameVideo.currentTime - autonomousStartTime) < 15 ? "autonomous" : "teleop",
        "endTime": null,
        "type": null, //can be: "Hatch Panel" || "Cargo"
        "location": null, // Can be: "Left Rocket" || "Right Rocket" || "Cargo Airship"
        "level": -1, //can be: 1 || 2 || 3 (1||2 if location is Cargo Airship)
        "side": null, //can be: "Left || Right || Middle [if location is Cargo Airship"] 
        "status": null, // Can be: "success" || "fail"
        "failReason": null, // Can be: TODO: add fail reasons codes for shooting events
        "competition": competition
    }
}

var place = null;

function placeit_start(s) {
    if (s == "Stop Cycle") {
        hideAllButtons();
        cycle.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
        cycle.status = 'Failure';
        cycle.failReason = s;
        delete cycle.place;
        delete cycle.pickup;

        console.log(cycle);
        sendEvent(cycle);
        initializeEvents();
    }
    else {
        place = Place();
        hideAllButtons();
        place_location(pickup.type);
    }

}



function place_location(type) {
    place.type = type;
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
            type: 'button',
            value: 'Cargo Airship'
        }
    ], place_side);
}
function place_side(location) {
    place.location = location;
    if (location == "Cargo Airship") {
        fillEventsDivWithObjects([
            {
                type: 'button',
                value: 'Left'
            },
            {
                type: 'button',
                value: 'Right'
            },
            {
                type: 'button',
                value: 'Middle'
            }
        ], place_level);
    } else if (place.type != "Cargo") {
        fillEventsDivWithObjects([
            {
                type: 'button',
                value: 'Left'
            },
            {
                type: 'button',
                value: 'Right'
            }
        ], place_level);

    } else {
        place_level(null);
    }

}
function place_level(side) {
    if (side == null) {
        delete place.side;
    }
    else {
        place.side = side;
    }
    if (place.location == 'Cargo Airship' && place.side == "Middle") {
        fillEventsDivWithObjects([
            {
                type: 'button',
                value: 1
            },
            {
                type: 'button',
                value: 2
            }

        ], place_status);

    }
    else {
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

        ], place_status);

    }
}
function place_status(level) {
    place.level = level;
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Success'
        },
        {
            type: 'buttonSelect',
            value: ['Failed because of interruption', 'Failed because of mechanical failure', 'failed because it fell']
        }
    ], place_finish)
}


function place_finish(status) {
    hideAllButtons();
    place.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
    if (status === 'Success') {
        place.status = status;
        delete place.failReason; // Prevent ElasticSearch from indexing this value
    } else {
        place.status = 'Failure';
        place.failReason = status;
    }

    cycle.pickup = pickup;
    cycle.place = place;
    cycle.timeTook = Math.round(place.endTime-pickup.startTime);
    cycle.endTime = place.endTime;
    sendEvent(place);
    sendEvent(cycle);
    initializeEvents();
}


// function pickup_start(placeholder) {
//     cycle.pickup = PickUp();
//     hideAllButtons();
//     pickup_type();
// }

// function pickup_type() {
//     fillEventsDivWithObjects([
//         {
//             type: 'button',
//             value: 'Hatch Panel'
//         },
//         {
//             type: 'button',
//             value: 'Cargo'
//         }
//     ], pickup_location);
// }

// function pickup_location(pickup_type) {
//     cycle.pickup.type = pickup_type;
//     fillEventsDivWithObjects([
//         {
//             type: 'button',
//             value: 'Floor'
//         },
//         {
//             type: 'button',
//             value: 'Feeder'
//         }
//     ], pickup_status);
// }

// function pickup_status(pickup_location) {
//     cycle.pickup.location = pickup_location;
//     fillEventsDivWithObjects([
//         {
//             type: 'button',
//             value: 'Success'
//         },
//         {
//             type:'buttonSelect',
//             value: ['Failed because of interruption', 'Failed because of mechanical failure']
//         }
//     ], pickup_finish);
// }


// function pickup_finish(pickup_status) {
//     cycle.pickup.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
//     if (cyclepickup_status === 'Success') {
//         cycle.pickup.status = pickup_status;
//         delete cycle.pickup.failReason;  // Prevent ElasticSearch from indexing this value
//     } else {
//         cycle.pickup.status = 'Failure';
//         cycle.pickup.failReason = pickup_status;
//         delete cycle.place;
//         finish_cycle();
//         return;
//     }

//     fillEventsDivWithObjects([
//         {
//             type: 'button',
//             value: 'Place Start'
//         }
//     ], placeit_start)

// }

// function placeit_start(sdf){
//     cycle.place = Place();
//     hideAllButtons();
//     place_what();
// }

// function place_what(){
//     fillEventsDivWithObjects([
//         {
//             type: 'button',
//             value: 'Hatch Panel'
//         },
//         {
//             type: 'button',
//             value: 'Cargo'
//         }

//     ],place_location);
// }

// function place_location(type) {
//     cycle.place.type=type;	
//     fillEventsDivWithObjects([
//         {
//             type: 'button',
//             value: 'Left Rocket'
//         },
//         {
//             type: 'button',
//             value: 'Right Rocket'
//         },
// 	{
// 	    type:'button',
// 	    value: 'Cargo Airship'
// 	}
//     ],place_level);
// }
// function place_level(location){
//     if(location=='Cargo Airship'){
//        return place_status(1);
//     }
//     fillEventsDivWithObjects([
// 	{
// 	    type: 'button',
// 	    value: 1
// 	},
// 	{
// 	    type: 'button',
// 	    value: 2
// 	},
// 	{
// 	    type: 'button',
// 	    value: 3
// 	}

//     ],place_status)
// }
// function place_status(level){
//     cycle.place.level=level;
//     fillEventsDivWithObjects([
//         {
//             type: 'button',
//             value: 'Success'
//         },
//         {
//             type:'buttonSelect',
//             value: ['Failed because of interruption', 'Failed because of mechanical failure','failed because it fell']
//         }
//     ], place_finish)
// }


// function place_finish(status) {
//     cycle.place.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
//     if (status === 'Success') {
//         cycle.place.status=status;
//         delete cycle.place.failReason; // Prevent ElasticSearch from indexing this value
//     } else {
//         cycle.place.status = 'Failure';
//         cycle.place.failReason = status;
//     }

// }

// function finish_cycle(){
//     cycle.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
//     if (cycle.pickup.status === 'Success' && cycle.place.status === 'Success'){
//         cycle.status = 'Success';
//         delete cycle.failReason;
//     }
//     else if (cycle.pickup.status === 'Success' && !(cycle.place.status === 'Success')){
//         cycle.status = 'Failure'
//         cycle.failReason = cycle
//     }
//     sendEvent(cycle);
//     initializeEvents();
// }

