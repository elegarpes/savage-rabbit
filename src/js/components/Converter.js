class Converter {

	constructor(time) {
		this.time = time;
	}

	get hour() {
		return this.calcHours();
	}

	get minutes(){
		return this.calcMins();
	}

	calcHours(){
		return Math.floor(duration/3600);
	}

	calcMins(){
		return (duration - this.hour*3600) / 60;
	}

	
}