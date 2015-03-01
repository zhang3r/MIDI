function process(text){
	var obj = text;
	var numbers = [];
	var notes = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24];
	var tweet = null;
	if( Array.isArray(obj) ) {
		for(var j=0; j< obj.length;j++){

            tweet = obj[j].text;
			for (var i = 0; i < tweet.length; i++) {
				var x = tweet.charAt(i).charCodeAt(0);
				if(x==32){
					continue;
				}
				if(x>73||x<48){
					x = (x%26)+48;
				}


				numbers.push(x);
			}
		}
	}else{
		tweet = obj.text;
		for (var k = 0; k < tweet.length; k++) {
			var num = tweet.charAt(k).charCodeAt(0) % notes.length;
			var note = notes[num] + 48;
			numbers.push(note);
		}
	}



	return numbers;
}

module.exports = {
	process: process
};
