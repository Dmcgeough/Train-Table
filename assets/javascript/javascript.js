
  // initialise firebase
  var config = {
    apiKey: "AIzaSyCC9nM26WYqVaRqqs-SuHstjTCHopGu_nQ",
    authDomain: "train-time-table-66636.firebaseapp.com",
    databaseURL: "https://train-time-table-66636.firebaseio.com",
    projectId: "train-time-table-66636",
    storageBucket: "train-time-table-66636.appspot.com",
    messagingSenderId: "407612463566"
  };
  
  firebase.initializeApp(config);
  // call a document.ready function in order to have everything load correctly before submitting
  $(document).ready(function(){

 
  //initialise variables that need to be global rather than local
  var db = firebase.database();
  var ref = db.ref();
  var timeLeft = 0;
  var nextArrival = 0;

  	// create on click function for the submit button and call the html id's for the values needed and giving them a variable. 
  	//prevent default is to ensure that the user clicks
	$("#submit-train").on("click", function() {
		event.preventDefault()
		var trainName = $("#train_name").val().trim();
      	var Destination = $("#destination").val().trim();
      	var firstTrainTime = $("#ftt").val().trim();
      	var Frequency = $("#frequency").val().trim();

      	// this next bit is to initialise variables needed to handle the time and covert it.
      	//into minutes and to pull the minutes until the next train would arrive using moment.js and a diff moment.
   		var convertedDate = moment(firstTrainTime, "HH:mm");
   		var difference = Math.abs(moment(convertedDate).diff(moment(), "minutes"));
   		timeLeft = parseInt(Frequency) - (difference % parseInt(Frequency));
   		
   		//this bit is to change the hrs and mins from strings into numbers and to correctly format them.
   		var nowHrs = parseInt(moment().format("HH"));
      	var nowMins = parseInt(moment().format("mm")) + timeLeft;
		    
      //this is to prevent a time from reading a minute function as 60 for example 21:60 becomes 22:00 with this bit of code.	
      	if(nowMins === 60) {
          	nowMins = "00";
          	nowHrs ++;
         	nextArrival = nowHrs + ":" + nowMins;
      	} else {
          	nextArrival = nowHrs + ":" + nowMins;
      	}
      	//this pushes the needed values to firebase which is important for the next step
   		ref.push({
        	train_name: trainName,
        	destination: Destination,
        	frequency: Frequency,
        	ftt: firstTrainTime,
        	nextArrival: nextArrival,
        	timeLeft: timeLeft
     	});
	});

   //this is a function saying that when there is a child added to the database
   db.ref().on("child_added", function(snapshot) {
  		
   		//append these values to the empty table
   		 $("#emptyTable").append("<tr><td>"+ snapshot.val().train_name
   		 + "</td> <td>"+ snapshot.val().destination
   		 + "</td> <td>"+ snapshot.val().frequency
   		 + "</td><td>"+ snapshot.val().nextArrival
   		 + "</td><td>"+ snapshot.val().timeLeft + "</td></tr>"); 
   		 });
   	});