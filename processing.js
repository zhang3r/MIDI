function process(text){
	var obj = text;
	var numbers = [];
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
	
	
	
	return numbers;
}