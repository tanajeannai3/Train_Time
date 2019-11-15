var firebaseConfig = {
    apiKey: "AIzaSyB7zTud3BSTHRVwN5NhfgMltqTosITBf3E",
    authDomain: "project1-f6f8d.firebaseapp.com",
    databaseURL: "https://project1-f6f8d.firebaseio.com",
    projectId: "project1-f6f8d",
    storageBucket: "project1-f6f8d.appspot.com",
    messagingSenderId: "555550562513",
    appId: "1:555550562513:web:6eacede597b8b17cd28df0",
    measurementId: "G-16MY69PYV7"
  };
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var tMinutesTillTrain = 0;


function displayRealTime() {
setInterval(function(){
    $('#current-time').html(moment().format('hh:mm A'))
  }, 1000);
}
displayRealTime();

 var tRow = "";
 var getKey = "";

 $("#submit-button").on("click", function() {
	event.preventDefault();

	var trainName = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrainTime = $("#first-train-time").val().trim();
	var trainFrequency = $("#frequency").val().trim();

	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(trainFrequency);

	if (trainName === "" || destination === "" || firstTrainTime === "" || trainFrequency === ""){
		$("#not-military-time").empty();
		$("#missing-field").html("ALL fields are required to add a train to the schedule.");
		return false;		
	}

	else if (trainName === null || destination === null || firstTrainTime === null || trainFrequency === null){
		$("#not-military-time").empty();
		$("#not-a-number").empty();
		$("#missing-field").html("ALL fields are required to add a train to the schedule.");
		return false;		
	}

	else if (firstTrainTime.length !== 5 || firstTrainTime.substring(2,3)!== ":") {
		$("#missing-field").empty();
		$("#not-a-number").empty();
		$("#not-military-time").html("Time must be in military format: HH:mm. For example, 15:00.");
		return false;
	}

	else if (isNaN(trainFrequency)) {
    	$("#missing-field").empty();
    	$("#not-military-time").empty();
    	$("#not-a-number").html("Not a number. Enter a number (in minutes).");
    	return false;
	}else {
		$("#not-military-time").empty();
		$("#missing-field").empty();
		$("#not-a-number").empty();

	    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
	    console.log(firstTimeConverted);

	    var currentTime = moment();
	    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	    console.log("DIFFERENCE IN TIME: " + diffTime);

	    var tRemainder = diffTime % trainFrequency;
	    console.log(tRemainder);

	    var tMinutesTillTrain = trainFrequency - tRemainder;
	    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
	    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

		var newTrain = {
			trainName: trainName,
			destination: destination,
			firstTrainTime: firstTrainTime,
			trainFrequency: trainFrequency,
			nextTrain: nextTrain,
			tMinutesTillTrain: tMinutesTillTrain,
			currentTime: currentTime.format("hh:mm A")
		};
		database.ref().push(newTrain);

		console.log("Train name in database: " + newTrain.trainName);
		console.log("Destination in database: " + newTrain.destination);
		console.log("First train time in database: " + newTrain.firstTrainTime);
		console.log("Train frequency in database: " + newTrain.trainFrequency);
		console.log("Next train in database: " + newTrain.nextTrain);
		console.log("Minutes away in database: " + newTrain.tMinutesTillTrain);
		console.log("Current time in database: " + newTrain.currentTime);

		$(".add-train-modal").html("<p>" + newTrain.trainName + " was successfully added to the current schedule.");
		$('#addTrain').modal();
		$("#train-name").val("");
		$("#destination").val("");
		$("#first-train-time").val("");
		$("#frequency").val("");
	}
});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	console.log(childSnapshot.val());
	console.log(prevChildKey);

	var trainName = childSnapshot.val().trainName;
	var destination = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().firstTrainTime;
	var trainFrequency = childSnapshot.val().trainFrequency;
	var nextTrain = childSnapshot.val().nextTrain;
	var tMinutesTillTrain = childSnapshot.val().tMinutesTillTrain;
	var currentTime = childSnapshot.val().currentTime;

    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

	var tRow = $("<tr>");
	var trainTd = $("<td>").text(trainName);
    var destTd = $("<td>").text(destination);
    var nextTrainTd = $("<td>").text(nextTrain);
    var trainFrequencyTd = $("<td>").text(trainFrequency);
    var tMinutesTillTrainTd = $("<td>").text(tMinutesTillTrain);

    tRow.append("", trainTd, destTd, trainFrequencyTd, nextTrainTd, tMinutesTillTrainTd);
    $("#schedule-body").append(tRow);
});