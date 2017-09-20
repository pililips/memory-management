var BlockSize = 1024;

var pointer = 0;

var initGen = [];
var initGenN = []
var initGenB = []
var initGenW = []
var holes = [];
var holes2 = [];
var holes3 = [];
var holes4 = [];

var holeFirstFit = holes;
var holeNextFit = holes2;
var holeBestFit = holes3;
var holeWorstFit = holes4;

var freeSpace = 0; 
var freeSpaceN = 0;
var freeSpaceB = 0;
var freeSpaceW =0;

var allInputSize = 0;
var allInputSizeN = 0;
var allInputSizeB = 0;
var allInputSizeW = 0;

var PartitionSpaceF;
var PartitionSpaceN;
var PartitionSpaceB;
var PartitionSpaceW;


function numGenParts(){
	var v = parseInt((Math.random() * 10)/2);
	if (v === 0) {
		v = parseInt(5);
	} else if (v < 4) {
		v=v+1;
	}
	return v;
};

function fillGeneric() {

	function randomStartPoint(){
		var startPoint = parseInt((Math.random()*800)/2);
		return startPoint;
	}

	function genPartSizee(sizing){
		var genPartSize = parseInt(Math.random()*sizing);
		return genPartSize;
	}

	var leftGenPart = numGenParts();
	console.log('Broj particija je: ' + leftGenPart);

	
	// startPoint for the first partition  
	pointer = randomStartPoint();

	if (pointer != 0) {
		var firstBegin = 0;
		var firstEnd = pointer;
		var firstSize = firstEnd;
		var firstHole = {start: firstBegin, end: firstEnd, size: firstSize};
		var NextHole = {start: firstBegin, end: firstEnd, size: firstSize};
		var bestHole = {start: firstBegin, end: firstEnd, size: firstSize};
		var worstHole = {start: firstBegin, end: firstEnd, size: firstSize};
		holes.push(firstHole);
		holes2.push(NextHole);
		holes3.push(bestHole);
		holes4.push(worstHole);
	}

	while ((pointer < BlockSize) && (leftGenPart > 0)) {

		var fitsTillEnd = false;

		//checks if partition can fit in
		while(fitsTillEnd === false){
			var sizing = 512;
			var genPartRemain = BlockSize - pointer;
	
			if ((genPartRemain < 101) && (genPartRemain > 10)){
				sizing = 100;
			} else if (genPartRemain < 11){
				sizing = 10;
			}

			var genPartSize = genPartSizee(sizing); 


			if((genPartSize <= genPartRemain) && genPartSize !== 0){
				fitsTillEnd = true;
			}
		};
	
		// end of new partition
		var partEnd = pointer + genPartSize;

		if(partEnd <= BlockSize) {
			var partition = {start: pointer, end: partEnd, size: genPartSize};
			initGen.push(partition);
			initGenN.push(partition)
			initGenB.push(partition)
			initGenW.push(partition)


			/*****************************************************************/

			var fatherDivSizeInPx = document.getElementById('firstPartition').clientWidth;
			var ratio = fatherDivSizeInPx / BlockSize;

			var contDivSize = document.getElementsByClassName('main');
			var x = contDivSize[0].clientWidth *0.05;
			console.log(x);

			var startDisplay = parseInt(x + pointer * ratio);
			var startDisplaySize = parseInt(genPartSize * ratio);
			if (startDisplaySize == 0){
				startDisplaySize = 1;
			}

			DrawAllPartitionsFit(startDisplay, startDisplaySize, genPartSize);

			/*****************************************************************/

			var firstlastHole = holes[holes.length - 1];
			var NextlastHole = holes2[holes2.length - 1];
			var bestLastHole = holes3[holes3.length -1];
			var worstLastHole = holes4[holes4.length -1];

			if (firstlastHole.end > pointer) {
				firstlastHole.end = pointer;
				firstlastHole.size = firstlastHole.end - firstlastHole.start;
				holes.splice(-1,1);
				holes.push(firstlastHole);
			}
			

			if (NextlastHole.end > pointer) {
				NextlastHole.end = pointer;
				NextlastHole.size = NextlastHole.end - NextlastHole.start;
				holes2.splice(-1,1);
				holes2.push(NextlastHole);
			}

			if (bestLastHole.end > pointer) {
				bestLastHole.end = pointer;
				bestLastHole.size = bestLastHole.end - bestLastHole.start;
				holes3.splice(-1,1);
				holes3.push(bestLastHole);
			}

			if (worstLastHole.end > pointer) {
				worstLastHole.end = pointer;
				worstLastHole.size = worstLastHole.end - worstLastHole.start;
				holes4.splice(-1,1);
				holes4.push(worstLastHole);
			}

			var ifEnd = partEnd;
			if(ifEnd <= BlockSize) {
				do {
				    pointer = genPartSizee(sizing);
				    pointer = ifEnd + pointer;
				    //console.log('Novi pointer: '+ pointer);
				}
				while (pointer > BlockSize);

				leftGenPart--;

				var endHole = pointer;
				if (leftGenPart === 0){
					endHole = BlockSize;
				}
				var holeSize = endHole - ifEnd;

				if(holeSize > 0){
					var hole = {start: ifEnd, end: endHole, size: holeSize};
					holes.push(hole);	
				}

				if(holeSize > 0){
					var hole = {start: ifEnd, end: endHole, size: holeSize};
					holes2.push(hole);	
				}

				if(holeSize > 0){
					var hole = {start: ifEnd, end: endHole, size: holeSize};
					holes3.push(hole);	
				}

				if(holeSize > 0){
					var hole = {start: ifEnd, end: endHole, size: holeSize};
					holes4.push(hole);	
				}
			}	

		}
	};

	pointer = 0;
	console.log('Pariticije: ');
	console.log(initGen);
	console.log('Rupe: ');
	console.log(holes);
	console.log(holes2);
	console.log(holes3);
	console.log(holes4);

	listholes(holes,"freespace-list");
	listholes(holes2,"freespaceN-list");
	listholes(holes3,"freespaceB-list");
	listholes(holes4,"freespaceW-list");

	updatepartitions(initGen,"partitionspace-list");
	updatepartitions(initGenN,"partitionspaceN-list");
	updatepartitions(initGenB,"partitionspaceB-list");
	updatepartitions(initGenW,"partitionspaceW-list");

};


function PartitionDelete (F,FT,genPartSize,n) {


var num = n;
var optionF = F;
var optionFT = FT;
var gPS = genPartSize;
//console.log(optionF);

if (num == 0){
	holeSpec = holeFirstFit;
	Gen = initGen; 
} else if (num == 1){
	holeSpec = holeNextFit; 
	Gen = initGenN;
} else if (num == 2){
	holeSpec = holeBestFit; 
	Gen = initGenB;
} else {
	holeSpec = holeWorstFit; 
	Gen = initGenW;
}


		var elem = document.getElementById(optionF.id);
		elem.remove(); // new version dom4 

		var child = document.getElementById(optionFT.id);
		child.parentNode.removeChild(child);
   	



    	var partid;

		for (var j = 0;j < Gen.length;j++){
			if (Gen[j].size == gPS){
				partid = j;
				//console.log(partid);
			}
		}


		console.log(Gen[partid].size == gPS);

		var partition = Gen[partid];

		var firstBegin = partition.start;
		//console.log(firstBegin);
		var firstEnd = partition.end;
		//console.log(firstEnd);
		var firstSize = partition.size;
		//console.log(firstSize);
		var NewHole = {start: firstBegin, end: firstEnd, size: firstSize};
		//console.log(NewHole);
		var done = false;
		var holeid = 0;


		for (var i = 0; i < holeSpec.length;i++){
			//console.log("tu");
			//console.log(holeSpec[i].end <= NewHole.start);
			//console.log(holeSpec[i].end);
			//console.log(NewHole.start);
			if (holeSpec[i].end <= NewHole.start){
				holeid = i+1;
				console.log("tuu");
			} 

		}

		console.log("holeid " + holeid );
		holeSpec.splice(holeid,0,NewHole);


		for (var i = 0;i < holeSpec.length;i++){
			console.log("oh");

			if (holeSpec[i].end == NewHole.start){
				holeSpec[i].end = NewHole.end;
				holeSpec[i].size = NewHole.size + holeSpec[i].size;
				holeSpec.splice(holeid,1);
				console.log("holeid" + holeid);
				console.log("ohh");
			}

		}

		for (var i =0; i<holeSpec.length;i++){
			for (var j=1;j<holeSpec.length;j++){
			 	if	(holeSpec[i].end == holeSpec[j].start){
			 			console.log("i " + i + "j " + j);
			 			holeSpec[i].end = holeSpec[j].end;
			 			holeSpec[i].size = holeSpec[j].size + holeSpec[i].size;
			 			console.log("j" + j);
			 			holeSpec.splice(j,1);
			 	}
			}
		}

		Gen.splice(partid,1);

			/////////////////////////////////////////////////////////////////////////////////


				var ps = document.getElementsByClassName("partitionspace-info");


				if (num == 0){
					PartitionSpaceF -= firstSize;
		    		ps[0].innerHTML = "Partitions Space: " + PartitionSpaceF +" kB";
				} else if (num == 1){
					PartitionSpaceN -= firstSize;
		    		ps[1].innerHTML = "Partitions Space: " + PartitionSpaceN +" kB";
				} else if (num == 2){
					PartitionSpaceB -= firstSize;
		    		ps[2].innerHTML = "Partitions Space: " + PartitionSpaceB +" kB";
				} else {
					PartitionSpaceW -= firstSize;
		    		ps[3].innerHTML = "Partitions Space: " + PartitionSpaceW +" kB";
				}
				

				if (num == 0){
		   	 		var fs = document.getElementsByClassName("freespace-info");
		    		freeSpace += firstSize;
		    		fs[0].innerHTML = "Free Space: " + freeSpace +" kB";
				} else if (num == 1){
		   	 		var fs = document.getElementsByClassName("freespace-info");
		    		freeSpaceN += firstSize;
		    		fs[1].innerHTML = "Free Space: " + freeSpaceN +" kB";
				} else if (num == 2){
		   	 		var fs = document.getElementsByClassName("freespace-info");
		    		freeSpaceB += firstSize;
		    		fs[2].innerHTML = "Free Space: " + freeSpaceB +" kB";
				} else {
		   	 		var fs = document.getElementsByClassName("freespace-info");
		    		freeSpaceW += firstSize;
		    		fs[3].innerHTML = "Free Space: " + freeSpaceW +" kB";
				}


				if (num == 0){
		    		updatepartitions(Gen, "partitionspace-list");
		    		updateholes(holeSpec, "freespace-list");
				} else if (num == 1){
		    		updatepartitions(Gen, "partitionspaceN-list");
		    		updateholes(holeSpec, "freespaceN-list");
				} else if (num == 2){
		    		updatepartitions(Gen, "partitionspaceB-list");
		    		updateholes(holeSpec, "freespaceB-list");
				} else {
		    		updatepartitions(Gen, "partitionspaceW-list");
		    		updateholes(holeSpec, "freespaceW-list");
				}




}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function DrawAllPartitionsFit(startDisplay, startDisplaySize,genPartSize){

    var sD = startDisplay;
	var sDS = startDisplaySize;
	var gPS = genPartSize;


	if ( typeof DrawFirstFit.counter == 'undefined' ) {
        // It has not... perform the initilization
        DrawFirstFit.counter = 0;
    }


	var firstF = document.createElement("div");

	firstF.id= "P_" + DrawFirstFit.counter; 

	firstF.style.display = "inline-block";
	firstF.style.position = "absolute";
	firstF.style.top = "25%";
	firstF.style.left = sD + "px"; 
	firstF.style.width = sDS + "px";
	firstF.style.height = "20px";
	firstF.style.background = "red";
	firstF.style.zIndex = "10";
	document.body.appendChild(firstF);

	var firstFT = document.createElement("div");

	firstFT.id= "PKB_" + DrawFirstFit.counter;

	firstFT.style.display = "inline-block";
	firstFT.style.position = "absolute";
	firstFT.style.top = "calc(25% - 20px)";
	firstFT.style.left = sD + "px";
	firstFT.style.height = "px";
	firstFT.style.background = "white";
	firstFT.style.color = "red";
	firstFT.style.zIndex = "10";
	firstFT.innerHTML = gPS + "kb";
	document.body.appendChild(firstFT);

	firstF.style.cursor = 'pointer';

	DrawFirstFit.counter++;

	
	var secondHalf = parseInt(document.body.clientWidth /2);

	if ( typeof DrawNextFit.counter == 'undefined' ) {
        // It has not... perform the initilization
        DrawNextFit.counter = 0;
    }


	var nextF = document.createElement("div");

	nextF.id= "NP_" + DrawNextFit.counter; 

	nextF.style.display = "inline-block";
	nextF.style.position = "absolute";
	nextF.style.top = "25%";
	nextF.style.left = secondHalf + sD + "px";
	nextF.style.width = sDS + "px";
	nextF.style.height = "20px";
	nextF.style.background = "red";
	nextF.style.zIndex = "10";
	document.body.appendChild(nextF);

	var nextFT = document.createElement("div");

	nextFT.id= "NPKB_" + DrawNextFit.counter;

	nextFT.style.display = "inline-block";
	nextFT.style.position = "absolute";
	nextFT.style.top = "calc(25% - 20px)";
	nextFT.style.left = secondHalf + sD + "px";
	nextFT.style.width = sDS + "px";
	nextFT.style.height = "20px";
	nextFT.style.background = "white";
	nextFT.style.color = "red";
	nextFT.style.zIndex = "10";
	nextFT.innerHTML = gPS + "kb";
	document.body.appendChild(nextFT);

	nextF.style.cursor = 'pointer';

	DrawNextFit.counter++;

	if ( typeof DrawBestFit.counter == 'undefined' ) {
        // It has not... perform the initilization
        DrawBestFit.counter = 0;
    }


	var bestF = document.createElement("div");

	bestF.id= "BP_" + DrawBestFit.counter;

	bestF.style.display = "inline-block";
	bestF.style.position = "absolute";
	bestF.style.top = "75%";
	bestF.style.left = sD + "px";
	bestF.style.width = sDS + "px";
	bestF.style.height = "20px";
	bestF.style.background = "red";
	bestF.style.zIndex = "10";
	document.body.appendChild(bestF);

	var bestFT = document.createElement("div");

	bestFT.id= "BPKB_" + DrawBestFit.counter; 

	bestFT.style.display = "inline-block";
	bestFT.style.position = "absolute";
	bestFT.style.top = "calc(75% - 20px)";
	bestFT.style.left = sD + "px";
	bestFT.style.width = sDS + "px";
	bestFT.style.height = "20px";
	bestFT.style.background = "white";
	bestFT.style.color = "red";
	bestFT.style.zIndex = "10";
	bestFT.innerHTML = gPS + "kb";
	document.body.appendChild(bestFT);

	bestF.style.cursor = 'pointer';

	DrawBestFit.counter++;

	if ( typeof DrawWorstFit.counter == 'undefined' ) {
        // It has not... perform the initilization
        DrawWorstFit.counter = 0;
    }


	var worseF = document.createElement("div");

	worseF.id= "WP_" + DrawWorstFit.counter;

	worseF.style.display = "inline-block";
	worseF.style.position = "absolute";
	worseF.style.top = "75%";
	worseF.style.left = secondHalf + sD + "px";
	worseF.style.width = sDS + "px";
	worseF.style.height = "20px";
	worseF.style.background = "red";
	worseF.style.zIndex = "10";
	document.body.appendChild(worseF);

	var worseFT = document.createElement("div");

	worseFT.id= "WP_" + DrawWorstFit.counter; 

	worseFT.style.display = "inline-block";
	worseFT.style.position = "absolute";
	worseFT.style.top = "calc(75% - 20px)";
	worseFT.style.left = secondHalf + sD + "px";
	worseFT.style.width = sDS + "px";
	worseFT.style.height = "20px";
	worseFT.style.background = "white";
	worseFT.style.color = "red";
	worseFT.style.zIndex = "10";
	worseFT.innerHTML = gPS + "kb";
	document.body.appendChild(worseFT);

	worseF.style.cursor = 'pointer';

	DrawWorstFit.counter++;

	firstF.onclick = function() { PartitionDelete(firstF,firstFT,gPS,0); PartitionDelete(nextF,nextFT,gPS,1); PartitionDelete(bestF,bestFT,gPS,2); PartitionDelete(worseF,worseFT,gPS,3) };
	nextF.onclick = function() { PartitionDelete(nextF,nextFT,gPS,1); PartitionDelete(firstF,firstFT,gPS,0); PartitionDelete(bestF,bestFT,gPS,2); PartitionDelete(worseF,worseFT,gPS,3) };
	bestF.onclick = function() { PartitionDelete(bestF,bestFT,gPS,2); PartitionDelete(firstF,firstFT,gPS,0); PartitionDelete(nextF,nextFT,gPS,1);  PartitionDelete(worseF,worseFT,gPS,3) };
	worseF.onclick = function() { PartitionDelete(worseF,worseFT,gPS,3); PartitionDelete(firstF,firstFT,gPS,0); PartitionDelete(nextF,nextFT,gPS,1); PartitionDelete(bestF,bestFT,gPS,2); };
	
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertPartitions(ele){
	
	if(event.keyCode == 13) {
       
    	if(ele.value > 1024){
			alert('Number higher than allowed');
		} else if (ele.value == 0){
			alert('Number can not be 0');       	
    	} else {
    		FirstFit(ele.value);
    		NextFit(ele.value);
    		BestFit(ele.value);
    		WorstFit(ele.value);
    	}
        
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function FirstFit(inputSize){

	var newInput = inputSize;
	console.log("FIRST FIT STARTS");
	var i = 0;
	var success = false;
	var stop = true;
	
	if(holeFirstFit.length > 0){


	do {



		if (holeFirstFit[i].size >= newInput) {
			console.log('Ima mesta');
			success = true;

			// crtanje
			var fatherDivSizeInPx = document.getElementById('firstPartition').clientWidth;
			console.log("FDSIP" + fatherDivSizeInPx);
			var contDivSize = document.getElementsByClassName('main');
			console.log("CDS" + contDivSize);
			var x = contDivSize[0].clientWidth *0.05;
			console.log("x" + x);
			var ratio = fatherDivSizeInPx / BlockSize;
			console.log("Ratio" + ratio);
			var startDisplay = parseInt(x + holeFirstFit[i].start * ratio);
			var startDisplaySize = parseInt(newInput * ratio);	
			if (startDisplaySize == 0){
				startDisplaySize = 1;
			}
			console.log("SDS" + startDisplaySize);
			console.log("SD" + startDisplay);
			
		    freeSpace -= newInput;
		    allInputSize = (allInputSize*1) + (newInput*1);

			DrawFirstFit(startDisplay, startDisplaySize, newInput);


			holeFirstFit[i].start = parseInt(holeFirstFit[i].start) + parseInt(newInput);
			holeFirstFit[i].size = parseInt(holeFirstFit[i].size) - parseInt(newInput);


			console.log('Nove rupe: ');
			console.log(holeFirstFit);
		};

		console.log('Velicina rupe: ' + holeFirstFit[i].size);

		if (holeFirstFit[i].size == 0){
		console.log("test");
		holeFirstFit.splice(i,1);
		}

		i++;
		
	}
	while ((i < holeFirstFit.length) && !success);

	if (!success){
		for (j = 0; j < holeFirstFit.length; j++) { 
    			if (holeFirstFit[j].size > newInput) {
    				var stop = false;
    			}
    	}
    			if (stop) {
    				alert('EROR - First Fit nema gde da ubaci ' + newInput +" kB");
    			}
	} 



	updateholes(holeFirstFit,"freespace-list");
	if(success){
		updateinputs(newInput,"inputspace-list");
	}


	
	} else {
		alert("EROR - Nema vise rupa u First Fit");
	}
}


function NextFit(inputSize){


	var newInput = inputSize;
	 console.log("NEXT FIT STARTS");
	 if ( typeof NextFit.counter == 'undefined' ) {
        // It has not... perform the initilization
        NextFit.counter = 0;
    }

    	 if ( typeof NextFit.lastFitPointer == 'undefined' ) {
        // It has not... perform the initilization
        NextFit.lastFitPointer = 0;
    }

	var success = false;
	var stop = true;

	if (holeNextFit.length > 0) {

	do {

			console.log(NextFit.lastFitPointer);
		if (NextFit.counter > holeNextFit.length- 1){
			console.log(NextFit.counter);
			console.log(holeNextFit.length - 1);
			console.log(stop);
			if(stop){
				NextFit.counter = NextFit.lastFitPointer;
			} else {	
    		NextFit.counter = NextFit.counter - 1;
    		}
    	    console.log(NextFit.counter);
    	    console.log(NextFit.lastFitPointer);
    	} 


		console.log(NextFit.counter); 

		if (holeNextFit[NextFit.counter].size >= newInput) {
			console.log('Ima mesta');
			success = true;

			// crtanje nove 
			var fatherDivSizeInPx = document.getElementById('nextPartition').clientWidth;
			var contDivSize = document.getElementsByClassName('main');
			var x = contDivSize[0].clientWidth + contDivSize[1].clientWidth *0.05;
			var ratio = fatherDivSizeInPx / BlockSize;
			var startDisplay = parseInt(x + holeNextFit[NextFit.counter].start * ratio); 
			var startDisplaySize = parseInt(newInput * ratio);
			if (startDisplaySize == 0){
				startDisplaySize = 1;
			}

			freeSpaceN -=newInput;
			allInputSizeN = (allInputSizeN*1) + (newInput*1);


			DrawNextFit(startDisplay, startDisplaySize, newInput);

			holeNextFit[NextFit.counter].start = parseInt(holeNextFit[NextFit.counter].start) + parseInt(newInput);
			holeNextFit[NextFit.counter].size = parseInt(holeNextFit[NextFit.counter].size) - parseInt(newInput);
			console.log('Nove rupe: ');
			console.log(holeNextFit);

		};
		console.log('Velicina rupe: ' + holeNextFit[NextFit.counter].size);

		if (holeNextFit[NextFit.counter].size == 0){
		console.log("test");
		holeNextFit.splice(NextFit.counter,1);
		}

		if (!success){
		 NextFit.counter++;
		}else {
			NextFit.lastFitPointer = NextFit.counter;
		}

		console.log(NextFit.lastFitPointer);
		console.log(NextFit.counter);

		if (NextFit.counter == holeNextFit.length && !success && NextFit.lastFitPointer != 0){
			NextFit.lastFitPointer =0;
			NextFit.counter = 0; 
		}

		if (NextFit.counter >= holeNextFit.length){
    		
    			for (i = 0; i < holeNextFit.length; i++) { 
    				if (holeNextFit[i].size > newInput) {
    					var stop = false;
    				}
    			}
    				if (stop) {
    					if (holeNextFit.length > 0){
    					alert('EROR - Next Fit nema gde da ubaci ' + newInput +" kB");
    					}
    				} else {
    					NextFit.counter = 0;
    				}
		}

	console.log(NextFit.counter);


	}
	while ((NextFit.counter < holeNextFit.length) && !success);

	updateholes(holeNextFit,"freespaceN-list");

	if(success){
		updateinputs(newInput,"inputspaceN-list");
	}

	
	} else {

	alert("EROR - Nema vise rupa u Next Fit");
	}
}

function BestFit(inputSize){

	var newInput = inputSize;
	console.log("BEST FIT STARTS");
	var i = 0;
	var success = false;
	var stop = true;
	if (holeBestFit.length > 0){

		do {
			console.log(holeBestFit);

			var min = holeBestFit[i].size;
			if (min <= 0){
				if (holeBestFit.lenght < i){
				min = holeBestFit[i+1].size;
			}
			}

			console.log(min);

		    for (var z = 1; z <= holeBestFit.length -1; z++){
		     		if(holeBestFit[z].size < min && holeBestFit[z].size >= newInput){
		     			
		     				min = holeBestFit[z].size;
		     				console.log('Velicina rupe: ' + holeBestFit[z].size);
		     				i = z;
		     				console.log(i);
		     				console.log(z);
		     			
		     		}

		    }
		    console.log(min);
		    console.log(z);

		    console.log(i);
		    console.log(holeBestFit);

			if (min >= newInput) {
				console.log('Ima mesta');
				success = true;

				// crtanje nove 
				var fatherDivSizeInPx = document.getElementById('bestPartition').clientWidth;
				var contDivSize = document.getElementsByClassName('main');
				var x =contDivSize[1].clientWidth *0.05;
				var ratio = fatherDivSizeInPx / BlockSize;
				var startDisplay = parseInt(x + holeBestFit[i].start * ratio);
				var startDisplaySize = parseInt(newInput * ratio);	
				if (startDisplaySize == 0){
					startDisplaySize = 1;
				}

			    freeSpaceB -= newInput;
			    allInputSizeB = (allInputSizeB*1) + (newInput*1); //moram ovako jer nece da prepozna kao integer

				DrawBestFit(startDisplay, startDisplaySize, newInput);

				holeBestFit[i].start = parseInt(holeBestFit[i].start) + parseInt(newInput);
				holeBestFit[i].size = parseInt(holeBestFit[i].size) - parseInt(newInput);
				console.log('Nove rupe: ');
				console.log(holeBestFit);
			};
			console.log('Velicina rupe: ' + holeBestFit[i].size);

			if (holeBestFit[i].size == 0){
			console.log("test");
			holeBestFit.splice(i,1);
			}

			i++;
		}
		while ((i < holeBestFit.length) && !success);

		if (!success){
			for (j = 0; j < holeBestFit.length; j++) { 
	    			if (holeBestFit[j].size > newInput) {
	    				var stop = false;
	    			}
	    	}
	    			if (stop) {
	    				alert('EROR - BestFit nema gde da ubaci ' + newInput +" kB");
	    			}
		} 

		updateholes(holeBestFit,"freespaceB-list");

		if(success){
			updateinputs(newInput,"inputspaceB-list");
		}

	} else {
		alert("EROR - Nema vise rupa u Best Fit");
	}
}

function WorstFit(inputSize){

	var newInput = inputSize;
	console.log("WORST FIT STARTS");
	var i = 0;
	var success = false;
	var stop = true;

	if (holeWorstFit.length > 0){
	
		do {
			console.log(holeWorstFit);

			var max = holeWorstFit[0].size;
			console.log(max);

		    for (var z = 1; z <= holeWorstFit.length -1; z++){
		     		if(holeWorstFit[z].size > max && holeWorstFit[z].size > newInput){
		     			
		     				max = holeWorstFit[z].size;
		     				console.log('Velicina rupe: ' + holeWorstFit[z].size);
		     				i = z;
		     				console.log(i);
		     				console.log(z);
		     			
		     		}

		    }
		    console.log(max);
		    console.log(z);

		    console.log(i);
		    console.log(holeWorstFit);

			if (holeWorstFit[i].size >= newInput) {
				console.log('Ima mesta');
				success = true;

				// crtanje nove 
				var fatherDivSizeInPx = document.getElementById('worstPartition').clientWidth;
				var contDivSize = document.getElementsByClassName('main');
				var x = contDivSize[0].clientWidth + contDivSize[1].clientWidth *0.05;
				var ratio = fatherDivSizeInPx / BlockSize;
				var startDisplay = parseInt(x + holeWorstFit[i].start * ratio);
				var startDisplaySize = parseInt(newInput * ratio);
				if (startDisplaySize == 0){
					startDisplaySize = 1;
				}	

			    freeSpaceW -= newInput;
			    allInputSizeW = (allInputSizeW*1) + (newInput*1); 

				DrawWorstFit(startDisplay, startDisplaySize, newInput);

				holeWorstFit[i].start = parseInt(holeWorstFit[i].start) + parseInt(newInput);
				holeWorstFit[i].size = parseInt(holeWorstFit[i].size) - parseInt(newInput);
				console.log('Nove rupe: ');
				console.log(holeWorstFit);
			};
			console.log('Velicina rupe: ' + holeWorstFit[i].size);

			if (holeWorstFit[i].size == 0){
			console.log("test");
			holeWorstFit.splice(i,1);
			}

			i++;
			
		}
		while ((i < holeWorstFit.length) && !success);

		if (!success){
			for (j = 0; j < holeWorstFit.length; j++) { 
	    			if (holeWorstFit[j].size > newInput) {
	    				var stop = false;
	    			}
	    	}
	    			if (stop) {
	    				alert('EROR - WorstFit nema gde da ubaci ' + newInput +" kB");
	    			}
		} 

		updateholes(holeWorstFit,"freespaceW-list");

		if(success){
			updateinputs(newInput,"inputspaceW-list");
		}
	} else {
		alert("EROR - Nema vise rupa u Worst Fit");
	}
}


///////////////////////////////////////////////////////////////////////////////////////////////////////

function DrawFirstFit(startDisplay, startDisplaySize, newInput){

	if ( typeof DrawFirstFit.counter == 'undefined' ) {
        // It has not... perform the initilization
        DrawFirstFit.counter = 0;
    }

	var sD = startDisplay;
	var sDS = startDisplaySize;
	var gPS = newInput;

	var firstF = document.createElement("div");
	firstF.id= "F_" + DrawFirstFit.counter; 
	firstF.style.display = "inline-block";
	firstF.style.position = "absolute";
	firstF.style.top = "25%";
	firstF.style.left = sD + "px";
	firstF.style.width = sDS + "px";
	firstF.style.height = "20px";
	firstF.style.background = "blue";
	firstF.style.zIndex = "10";
	firstF.title = gPS + "kB";
	document.body.appendChild(firstF);

	var firstFT = document.createElement("div");
	firstFT.id= "FKB_" + DrawFirstFit.counter; 
	firstFT.style.display = "inline-block";
	firstFT.style.position = "absolute";
	firstFT.style.top = "30%";
	firstFT.style.left = sD + "px";
	firstFT.style.height = "20px";
	firstFT.style.background = "white";
	firstFT.style.color = "blue";
	firstFT.innerHTML = gPS + "kb";
	console.log(firstFT.id);
	document.body.appendChild(firstFT);

	var fs = document.getElementById("freeSpaceFirst");
    fs.innerHTML = "Free Space: " + freeSpace +" kB";

    
    var is = document.getElementById("inputSpaceFirst");
    is.innerHTML = "Input Space: " + (allInputSize*1) +" kB";

    DrawFirstFit.counter++;
    console.log("PROBA" + DrawFirstFit.counter);


}


function DrawNextFit(startDisplay, startDisplaySize, newInput){

if ( typeof DrawNextFit.counter == 'undefined' ) {
        // It has not... perform the initilization
        DrawNextFit.counter = 0;
    }


	var sD = startDisplay;
	var sDS = startDisplaySize;
	var gPS = newInput;
	var ok;

	var NextF = document.createElement("div");
	NextF.id= "N_" + DrawFirstFit.counter; 
	NextF.style.display = "inline-block";
	NextF.style.position = "absolute";
	NextF.style.top = "25%";
	NextF.style.left =  sD + "px";
	NextF.style.width = sDS + "px";
	NextF.style.height = "20px";
	NextF.style.background = "blue";
	NextF.style.zIndex = "10";
	NextF.title = gPS + "kB";
	document.body.appendChild(NextF);

	var NextFT = document.createElement("div");
	NextFT.style.display = "inline-block";
	NextFT.style.position = "absolute";
	NextFT.style.top = "30%";
	NextFT.style.left =  sD + "px";
	NextFT.style.height = "20px";
	NextFT.style.background = "white";
	NextFT.style.color = "blue";
	NextFT.innerHTML = gPS + "kb";
	document.body.appendChild(NextFT);

	var fs = document.getElementById("freeSpaceNext");
    fs.innerHTML = "Free Space: " + freeSpaceN +" kB";

    var is = document.getElementById("inputSpaceNext");
    is.innerHTML = "Input Space: " + (allInputSizeN*1) +" kB";

}

function DrawBestFit(startDisplay, startDisplaySize, newInput){

if ( typeof DrawBestFit.counter == 'undefined' ) {
        // It has not... perform the initilization
        DrawBestFit.counter = 0;
    }

	var sD = startDisplay;
	var sDS = startDisplaySize;
	var gPS = newInput;

	var BestF = document.createElement("div");
	BestF.id= "B_" + DrawFirstFit.counter; 
	BestF.style.display = "inline-block";
	BestF.style.position = "absolute";
	BestF.style.top = "75%";
	BestF.style.left = sD + "px";
	BestF.style.width = sDS + "px";
	BestF.style.height = "20px";
	BestF.style.background = "blue";
	BestF.style.zIndex = "10";
	BestF.title = gPS + "kB";
	document.body.appendChild(BestF);

	var BestFT = document.createElement("div");
	BestFT.style.display = "inline-block";
	BestFT.style.position = "absolute";
	BestFT.style.top = "80%";
	BestFT.style.left = sD + "px";
	BestFT.style.height = "20px";
	BestFT.style.background = "white";
	BestFT.style.color = "blue";
	BestFT.innerHTML = gPS + "kb";
	document.body.appendChild(BestFT);

	var fs = document.getElementById("freeSpaceBest");
    fs.innerHTML = "Free Space: " + freeSpaceB +" kB";

    var is = document.getElementById("inputSpaceBest");
    is.innerHTML = "Input Space: " + (allInputSizeB*1) +" kB";

}

function DrawWorstFit(startDisplay, startDisplaySize, newInput){

if ( typeof DrawWorstFit.counter == 'undefined' ) {
        // It has not... perform the initilization
        DrawWorstFit.counter = 0;
    }

	var sD = startDisplay;
	var sDS = startDisplaySize;
	var gPS = newInput;

	var WorstF = document.createElement("div");
	WorstF.id= "W_" + DrawFirstFit.counter; 
	WorstF.style.display = "inline-block";
	WorstF.style.position = "absolute";
	WorstF.style.top = "75%";
	WorstF.style.left = sD + "px";
	WorstF.style.width = sDS + "px";
	WorstF.style.height = "20px";
	WorstF.style.background = "blue";
	WorstF.style.zIndex = "10";
	WorstF.title = gPS + "kB";
	document.body.appendChild(WorstF);

	var WorstFT = document.createElement("div");
	WorstFT.style.display = "inline-block";
	WorstFT.style.position = "absolute";
	WorstFT.style.top = "80%";
	WorstFT.style.left = sD + "px";
	WorstFT.style.height = "20px";
	WorstFT.style.background = "white";
	WorstFT.style.color = "blue";
	WorstFT.innerHTML = gPS + "kb";
	document.body.appendChild(WorstFT);

	var fs = document.getElementById("freeSpaceWorst");
    fs.innerHTML = "Free Space: " + freeSpaceW +" kB";

    var is = document.getElementById("inputSpaceWorst");
    is.innerHTML = "Input Space: " + (allInputSizeW*1) +" kB";
}


/////////////////////////////////////////////////////////////////////



function writespaces(){
	var fs = document.getElementsByClassName("freespace-info");

    for(var h = 0; h < holes.length; h++) {
    	freeSpace += holes[h].size;
    }

    freeSpaceN +=freeSpace;
    freeSpaceB += freeSpace;
    freeSpaceW += freeSpace;

    for (var p = 0; p < 4; p++){
    	fs[p].innerHTML = "Free Space: " + freeSpace +" kB";
	}

	var ps = document.getElementsByClassName("partitionspace-info");
		PartitionSpace = BlockSize - freeSpace;

	for (var p = 0; p < 4; p++){
    	ps[p].innerHTML = "Partitions Space: " + PartitionSpace +" kB";
	}

	PartitionSpaceF = PartitionSpace;
	PartitionSpaceN = PartitionSpace;
	PartitionSpaceB = PartitionSpace;
	PartitionSpaceW = PartitionSpace;

	var is = document.getElementsByClassName("inputspace-info");

	for (var s = 0; s < 4; s++){
		is[s].innerHTML = "Input Space: " + 0*1 +" kB" ;
	}
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////

function listholes(holes, id){
	var h = holes;

	for (var i = 0; i < h.length; i++){
	var para = document.createElement("P");
    var t = document.createTextNode(" hole" + i + " = " + h[i].size + " kB,");
    para.appendChild(t);
    document.getElementById(id).appendChild(para);
	}
}

function updateholes(holes, id){
	var h = holes;

	document.getElementById(id).innerHTML = null;
	for (var i = 0; i < h.length; i++){
	var para = document.createElement("P");
    var t = document.createTextNode(" hole" + i + " = " + h[i].size + " kB,");
    para.appendChild(t);
    document.getElementById(id).appendChild(para);
	}
}

    function holesshow(id) {
    	var but = id;
    	console.log(id);
    	if (but == 1){
    	    	var idd = "freespace-list";
    	}else if (but ==2){
    			var idd = "freespaceN-list";
    	} else if (but ==3){
    		var idd = "freespaceB-list";
    	} else if (but == 4){
    		var idd = "freespaceW-list";
    	}
    	 
    	console.log(idd);
    	if (document.getElementById(idd).style.display == "block") 
    	{
    		document.getElementById(idd).style.display = 'none';
    		document.getElementById(idd).style.visibility = 'none';
    	}
    	else 
    	{
    		document.getElementById(idd).style.display = 'block';
    		document.getElementById(idd).style.visibility = 'visible';
    	}
        
    }

////////////////////////////////////////////////////////////////////////////////////////////////


function updateinputs(inputs, id){

	var f = document.getElementById("inputspace-list").id;
	var n = document.getElementById("inputspaceN-list").id;
	var b = document.getElementById("inputspaceB-list").id;
	var w = document.getElementById("inputspaceW-list").id;
	console.log(f);
	console.log(id);

	if (id == f){
		if ( typeof updateinputs.counterF == 'undefined' ) {
			updateinputs.counterF = 0;
		}

		var inp = inputs;
		console.log(inputs);

		var para = document.createElement("P");
    	var t = document.createTextNode(" input" + updateinputs.counterF + " = " + inp + " kB,");
    	console.log(t);
    	para.appendChild(t);
    	document.getElementById(id).appendChild(para);

	} else if (id == n){
		if ( typeof updateinputs.counterN == 'undefined' ) {	
			updateinputs.counterN = 0;
		}

			var inp = inputs;
			console.log(inputs);

				var para = document.createElement("P");
    			var t = document.createTextNode(" input" + updateinputs.counterN + " = " + inp + " kB,");
   		 	console.log(t);
    		para.appendChild(t);
    		document.getElementById(id).appendChild(para);

	} else if (id == b){
		if ( typeof updateinputs.counterB == 'undefined' ) {
			updateinputs.counterB = 0;
		}
			var inp = inputs;
			console.log(inputs);

			var para = document.createElement("P");
    		var t = document.createTextNode(" input" + updateinputs.counterB + " = " + inp + " kB,");
    		console.log(t);
    		para.appendChild(t);
    		document.getElementById(id).appendChild(para);

	} else if (id ==w){
		if ( typeof updateinputs.counterW == 'undefined' ) {
			updateinputs.counterW = 0;
		}
			var inp = inputs;
			console.log(inputs);

			var para = document.createElement("P");
    		var t = document.createTextNode(" input" + updateinputs.counterW + " = " + inp + " kB,");
    		console.log(t);
    		para.appendChild(t);
    		document.getElementById(id).appendChild(para);
	}

    if (id == f){
		updateinputs.counterF++;
	} else if (id == n){
		updateinputs.counterN++;
	} else if (id == b){
		updateinputs.counterB++;
	} else if (id == w){
		updateinputs.counterW++;
	}


}

    function inputsshow(id) {
    	var but = id;
    	console.log(id);
    	if (but == 1){
    	    	var idd = "inputspace-list";
    	}else if (but ==2){
    			var idd = "inputspaceN-list";
    	} else if (but ==3){
    		var idd = "inputspaceB-list";
    	} else if (but == 4){
    		var idd = "inputspaceW-list";
    	}
    	 
    	console.log(idd);
    	if (document.getElementById(idd).style.display == "block") 
    	{
    		document.getElementById(idd).style.display = 'none';
    		document.getElementById(idd).style.visibility = 'none';
    	}
    	else 
    	{
    		document.getElementById(idd).style.display = 'block';
    		document.getElementById(idd).style.visibility = 'visible';
    	}
        
    }

 /////////////////////////////////////////////////////////////////////////////////////////////////////////   

function updatepartitions(partition, id){

	document.getElementById(id).innerHTML = null;

	var p = partition;

	for (var i = 0; i < p.length; i++){
	var para = document.createElement("P");
    var t = document.createTextNode(" partition" + i + " = " + p[i].size + " kB,");
    para.appendChild(t);
    document.getElementById(id).appendChild(para);
	}
}


function partitionshow(id) {
    	var but = id;
    	console.log(id);
    	if (but == 1){
    	    	var idd = "partitionspace-list" ;
    	}else if (but ==2){
    			var idd = "partitionspaceN-list";
    	} else if (but ==3){
    		var idd = "partitionspaceB-list";
    	} else if (but == 4){
    		var idd = "partitionspaceW-list";
    	}
    	 
    	console.log(idd);
    	if (document.getElementById(idd).style.display == "block") 
    	{
    		document.getElementById(idd).style.display = 'none';
    		document.getElementById(idd).style.visibility = 'none';
    	}
    	else 
    	{
    		document.getElementById(idd).style.display = 'block';
    		document.getElementById(idd).style.visibility = 'visible';
    	}

        
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.onkeyup=function(e){
  var e = e || window.event; // for IE to cover IEs window event-object
  if(e.altKey && e.which == 82) {
  	location.reload();
    return false;
  }
}


function deletePartitions(id){
	var elem = document.getElementById(id);
	elem.remove();
}

function helpshow(id) {

    	var but = id;
    	console.log(id);
    	if (but == 0){
    	    	var idd = "firsthelp";
    	}else if (but ==1){
    			var idd = "twohelp";
    	} else if (but ==2){
    		var idd = "threehelp";
    	} else if (but == 3){
    		var idd = "fourhelp";
    	}
    	 
    	console.log(idd);
    	if (document.getElementById(idd).style.display == "block") 
    	{
    		document.getElementById(idd).style.display = 'none';
    		document.getElementById(idd).style.visibility = 'none';
    		//var col = document.getElementsByClassName("partition-text");
    		//col[but].style.background = "#FFF"
    		

    	}
    	else 
    	{
    		document.getElementById(idd).style.display = 'block';
    		document.getElementById(idd).style.visibility = 'visible';
    		//var col = document.getElementsByClassName("partition-text");
    		//col[but+1].style.background = "#03A9F4";
    	}
        
    }



