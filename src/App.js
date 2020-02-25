import React, { Component } from 'react';
import './App.css';

const MonthLength = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const MacroStates = {
	INACTIVE: 0,
	PLAYING:  1,
	PAUSED:   2,
	FINISHED: 3
}

function arrayFindIndex(array, toFind) {
	var found = -1;

	array.forEach((item, i) => {
		if(item === toFind) found = i;
	});

	return found;
}

function ConvertDate(date) {
	let day   = date.getDate().toString();
	let month = (date.getMonth() + 1).toString();
	if(date.getMonth() < 9) month = "0" + month;
	let year  = date.getFullYear().toString();

	return year + "-" + month + "-" + day;
}

async function LoadJson(path) {
	var res = null;

	res = await fetch(path).then(response => { return response.json(); } );

	return res;
}

// React Components
function MacroButton(props) {
	var style = { background : "white" };
	if(props.selected) style = {background : "black"};

	return (
		<div className = "macro">
			<div className = "macro-button" id = {props.name} style = {style}
				onClick = {e => props.clickHandler(props.index)}>
				<img className = "icon" src = {props.src} alt = {"Icon " + props.name}/>
			</div>
			<label className = "macro-button-label">
				{props.name}
			</label>
		</div>
	);
}

function ProgressBar(props) {
	const width = { width : `${props.percentage}%` };

	return (
		<div className = "progress-bar">
			<div className = "filler" style = {width} />
		</div>
	);
}

function KeyLog(props) {
	return (
		<div key = {props.ind} className = "key-log">
			<b className = "key-log-cell"> {props.pressedKey} </b>
			<b className = "key-log-cell"> {props.onTime} </b>
			<b className = "key-log-cell"> {props.offTime} </b>
		</div>
	);
}

/*
class CheckBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.props.onChange(event.target.checked);
	}

	render() {
		return (
			<input type = "checkbox" checked = {this.props.checked} onChange = {this.handleChange} />
		);
	}
}
*/

class DateInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		if(event.target.value === "") {
			this.props.onChange(ConvertDate(new Date()));
			return;
		}

		this.props.onChange(event.target.value);
	}

	render() {
		return (
			<input type = "date" className = "date-input"
			readOnly = {this.props.readonly}
			value = {this.props.date} onChange = {this.handleChange}/>
		);
	}
}

class IntegerInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		if(event.target.value === "") {
			this.props.onChange(1);
			return;
		}

		this.props.onChange(parseInt(event.currentTarget.value));
	}

	render() {
		return (
			<input type = "number" className = "integer-input"
			readOnly = {this.props.readonly}
			value = {this.props.value} onChange = {this.handleChange}
			max = {this.props.max} min = {this.props.min}/>
		);
	}
}

class ParameterInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {active : false, locked : false};
	}

	render() {
		var params = this.props.parameters;

		switch(this.props.macro) {
			default:
			break;

			case "Time Skip":
				return (
					<div className = "macro-parameters" id = "TimeSkipParams">
						<div className = "parameters-entry">
							<label className = "parameter-label">
								Start Date
							</label>
							<div className = "parameter">
								<DateInput id = "startDate" name = "start-date"
									date = {params.startDate}
									onChange = {date => this.props.eventHandler("startDate", date)}
									/>
							</div>
						</div>
						<div className = "parameters-entry">
							<label className = "parameter-label">
								End Date
							</label>
							<div className = "parameter">
								<DateInput id = "endDate" name = "end-date"
									date = {params.endDate}
									onChange = {date => this.props.eventHandler("endDate", date)}
									/>
							</div>
						</div>
						<div className = "parameters-entry">
							<label className = "parameter-label">
								Skip Count
							</label>
							<div className = "parameter">
								<IntegerInput id = "daysToAdvance" name = "days-to-advance"
									value = {params.daysToAdvance}
									onChange = {value => this.props.eventHandler("daysToAdvance", value)}
									min = "1" max = "10000"
									/>
							</div>
						</div>
					</div>
				);

			case 1:
				return (
					<div className = "macro-parameters" id = "TimeSkipParams">
					</div>
				);

			case 2:
				return (
					<div className = "macro-parameters" id = "TimeSkipParams">
					</div>
				);
		}
	}
}

// Coroutine Wrapper
function coroutine(f, args) {
	var o = f.apply(args);

	o.next();

	return function(x) {
		return o.next(x);
	}
}

class SimpleDate {
	constructor(str) {
		this.day   = 0;
		this.month = 0;
		this.year  = 0;

		this.setFromString(str);
	}

	isLeapYear() {
		if(this.year % 4 === 0) {
			if(this.year % 100 !== 0 || this.year % 400 === 0) {
				return true;
			}
		}

		return false;
	}

	increment(days) {
		this.day += days;

		let len = MonthLength[this.month];

		let rem = this.day - len;
		if(this.month === 1 && !this.isLeapYear()) {
			rem += 1;
		}

		while(rem > 0) {
			this.day = rem;

			this.month += 1;

			if(this.month === 12) {
				this.year += 1;
				this.month = 0;
			}

			len = MonthLength[this.month];

			rem = this.day - len;
			if(this.month === 1 && !this.isLeapYear()) {
				rem += 1;
			}
		}
	}

	decrement(days) {
		this.day -= days;

		while(this.day <= 0) {
			this.month -= 1;

			if(this.month < 0) {
				this.month = 11;
				this.year -= 1;
			}

			let len = MonthLength[this.month];
			if(this.month === 1 && !this.isLeapYear()) len -= 1;

			this.day += len;
		}
	}

	dayDifference(other) {
		var date1 = new Date(this.toString());
		var date2 = new Date(other.toString());

		var diff = date2.getTime() - date1.getTime();

		return diff / (1000 * 60 * 60 * 24);
	}

	daysToNextMonth() {
		let len = MonthLength[this.month];
		if(this.month === 1 && !this.isLeapYear()) len -= 1;

		return len - this.day + 1;
	}

	setFromString(str = "2020-01-01") {
		this.year  = parseInt(str.substr(0, 4));
		this.month = parseInt(str.substr(5, 2)) - 1;
		this.day   = parseInt(str.substr(8, 2));
	}

	toString() {
		let day   = this.day.toString();
		if(this.day <= 9) day = "0" + day;

		let month = (this.month + 1).toString();
		if(this.month < 9) month = "0" + month;

		let year  = this.year.toString();

		return year + "-" + month + "-" + day;
	}

	compare(other) {
		let oYear = other.year;

		if(oYear === this.year) {
			let oMonth = other.month;

			if(oMonth === this.month) {
				return other.day - this.day;
			}
			else {
				return oMonth - this.month;
			}
		}
		else {
			return oYear - this.year;
		}
	}
}

class JSONManeger {
	constructor() {
		this.filenames = {
			FstSkipD  : "FirstSkipDay.json",
			FstSkipM  : "FirstSkipDayMonth.json",
			FstSkipY  : "FirstSkipDayMonthYear.json",
			AdvDay    : "AdvanceDay.json",
			AdvMonth  : "AdvanceMonth.json",
			AdvYear   : "AdvanceYear.json",
			AdvYearLp : "AdvanceYearLeap.json",
			AdvDec    : "AdvanceDecember.json"
		};

		this.loaded = {
			FstSkipD  : "",
			FstSkipM  : "",
			FstSkipY  : "",
			AdvDay    : "",
			AdvMonth  : "",
			AdvYear   : "",
			AdvDec    : "",
			AdvYearLp : "",
			count     :  8
		};

		this.loadedCount = 0;
		this.loadConcluded = false;

		var keys = ["FstSkipD", "FstSkipM", "FstSkipY", "AdvDay",
		"AdvMonth", "AdvYear", "AdvYearLp", "AdvDec"];

		for(var k in keys) {
			this.loadMacro(keys[k]);
		}
	}

	async loadMacro(key) {
		var filename = this.filenames[key];

		this.loaded[key] = await LoadJson("./macros/" + filename);

		this.loadedCount += 1;

		if(this.loadedCount === this.loaded.count) {
			this.loadConcluded = true;
			console.log("JSON Load Concluded");
		}
	}

	getMacro(key) {
		var copy = JSON.parse(JSON.stringify(this.loaded[key]));
		return copy;
	}
}

class MacroBuilder {
	constructor(jsonM, name, icon) {
		this.jsonManager = jsonM;

		this.name = name;
		this.icon = icon;

		this.macro = 0;
		this.macroJSON = [];

		this.parameters = {};
		this.paramHandlers = {};
	}

	changeParameter(key, value) {
		let handler = this.paramHandlers[key];

		return handler(value);
	}

	getMacro(key) {
		if(!this.jsonManager.loadConcluded) return null;

		return this.jsonManager.getMacro(key);
	}

	concatToMacro(segment) {
		this.macroJSON = this.macroJSON.concat(segment);
	}

	// Render
	getRenderData() {
		return {
			name : this.name,
			icon : this.icon,
			parameters : this.parameters
		};
	}
}

class TimeSkipMacroBuilder extends MacroBuilder {
	constructor(jsonM) {
		super(jsonM, "Time Skip", "./images/timeskip_icon.png");

		// Init Parameters
		var today    = new Date();
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		this.parameters.startDate = ConvertDate(today);
		this.parameters.endDate   = ConvertDate(tomorrow);
		this.parameters.daysToAdvance = 1;

		this.onStartDateChange = this.onStartDateChange.bind(this);
		this.onEndDateChange   = this.onEndDateChange.bind(this);
		this.onDaysToAdvanceChange = this.onDaysToAdvanceChange.bind(this);

		this.paramHandlers = {
			startDate : this.onStartDateChange,
			endDate   : this.onEndDateChange,
			daysToAdvance : this.onDaysToAdvanceChange
		};

		this.currentDate = 0;
	}

	// Parameter Handlers
	onStartDateChange(newDate) {
		if(this.parameters.startDate !== newDate) {
			var startDate = new SimpleDate(newDate);
			var endDate   = new SimpleDate(this.parameters.endDate);

			this.parameters.startDate = newDate;

			if(startDate.compare(endDate) <= 0) {
				endDate = new SimpleDate(startDate.toString());
				endDate.increment(1);

				this.parameters.endDate = endDate.toString();
			}

			this.parameters.daysToAdvance = startDate.dayDifference(endDate);

			return true;
		}

		return false;
	}

	onEndDateChange(newDate) {
		if(this.parameters.endDate !== newDate) {
			var endDate   = new SimpleDate(newDate);
			var startDate = new SimpleDate(this.parameters.startDate);

			this.parameters.endDate = newDate;

			if(startDate.compare(endDate) <= 0) {
				startDate = new SimpleDate(endDate.toString());
				startDate.decrement(1);

				this.parameters.startDate = startDate.toString();
			}

			this.parameters.daysToAdvance = startDate.dayDifference(endDate);

			return true;
		}

		return false;
	}

	onDaysToAdvanceChange(days) {
		if(this.parameters.daysToAdvance !== days) {
			this.parameters.daysToAdvance = days;

			var endDate = new SimpleDate(this.parameters.startDate);

			endDate.increment(days);

			var maxDate = new SimpleDate("2059-11-31");

			if(endDate.compare(maxDate) < 0) {
				this.parameters.endDate = "2059-11-31";
			}
			else {
				this.parameters.endDate = endDate.toString();
			}

			return true;
		}

		return false;
	}

	// Build Macro
	AdvanceDay(days) {
		var macro = this.getMacro("AdvDay");

		macro[0].count = days;

		return macro;
	}

	AdvanceMonth(days) {
		var macro = this.getMacro("AdvMonth");

		var segment = macro[0];

		segment.count = days - 1;
		macro[0] = segment;

		return macro;
	}

	InitMacro(startDate, currentDate) {
		// If the day after the start is in the next Month
		if(startDate.month < this.currentDate.month) {
			// If the day after the start is in the next Year
			if(startDate.year < this.currentDate.year) {
				this.concatToMacro(this.getMacro("FstSkipY"));  // Advance the Day, Month and Year
			}

			// It is in the same Year
			else {
				this.concatToMacro(this.getMacro("FstSkipM"));  // Advance the Day and Month
			}
		}

		// It is in the same Month
		else {
			this.concatToMacro(this.getMacro("FstSkipD"));
		}

		currentDate.increment(1);
	}

	NextMacroSegment(currentDate, endDate) {
		let cYear  = currentDate.year;
		let cMonth = currentDate.month;
		let cDay   = currentDate.day;

		let eYear  = endDate.year;
		let eMonth = endDate.month;
		let eDay   = endDate.day;

		let daysToGo = 0;

		// If Target Year has been reached
		if(cYear === eYear) {
			// If Target Month has been reached
			if(cMonth === eMonth) {
				daysToGo = eDay - cDay;

				this.concatToMacro(this.AdvanceDay(daysToGo));
			}

			// Not at Target Month and at the start of a Month
			else if(cDay === 1){
				let i = cMonth;
				for(; i < eMonth; i++) {
					daysToGo = MonthLength[i];

					this.concatToMacro(this.AdvanceMonth(daysToGo));
				}
			}

			// Not at Target Month and not at the start of a Month
			else {
				daysToGo = currentDate.daysToNextMonth();

				this.concatToMacro(this.AdvanceMonth(daysToGo));
			}

			currentDate.increment(daysToGo);
		}

		// Not at Target Year and at the start of a Month
		else if(cDay === 1){
			// If it's January
			if(cMonth === 0) {
				// If it's a Leap Year
				if(this.isLeapYear(cYear)) {
					this.concatToMacro(this.getMacro("AdvYearLp"));

					currentDate.increment(366);
				}

				// If Not
				else {
					this.concatToMacro(this.getMacro("AdvYear"));

					currentDate.increment(365);
				}
			}

			// If it's December
			else if(cMonth === 11) {
				this.concatToMacro(this.getMacro("AdvDec"));

				currentDate.increment(31);
			}

			// Other Months
			else {
				let i = cMonth;
				for(; i < 11; i++) {
					daysToGo = currentDate.daysToNextMonth();

					this.concatToMacro(this.AdvanceMonth(daysToGo));

					currentDate.increment(daysToGo);
				}
			}
		}

		// Not Target Year and not at the start of a Month
		else {
			// If it is December
			if(cMonth === 11) {
				var macro = this.getMacro("AdvDec");

				var segment = macro[0];
				segment.count = 31 - cDay;
				macro[0] = segment;

				this.concatToMacro(macro);

				currentDate.increment(31);
			}

			// Any other Month
			else {
				daysToGo = this.currentDate.daysToNextMonth();

				this.concatToMacro(this.AdvanceMonth(daysToGo));

				currentDate.increment(daysToGo);
			}
		}
	}

	build() {
		if(!this.jsonManager.loadConcluded) return null;

		this.macroJSON = []; // Clear Macro JSON

		var startDate = new SimpleDate(this.parameters.startDate);
		var endDate   = new SimpleDate(this.parameters.endDate);

		var currentDate = new SimpleDate(this.parameters.startDate);

		this.InitMacro(startDate, currentDate);

		// While End Date has not been reached
		while(currentDate.compare(endDate) > 0) {
			this.NextMacroSegment(currentDate, endDate);
		}

		this.macro = new Macro(this.name, this.icon, this.macroJSON);

		return this.macro;
	}
}

class KeyLogger {
	constructor() {
		this.log = [];
		this.log_count = 0;

		this.active = [];
		this.active_count = 0;
	}

	clear() {
		this.log = [];
		this.log_count = 0;

		this.active = [];
		this.active_count = 0;
	}

	pressKey(key, time) {
		var ind = arrayFindIndex(this.active, key);

		// If key is not pressed
		if(ind === -1) {
			this.active[this.active_count] = key;
			this.active_count++;

			this.logKeyPress(key, time);
		}
	}

	logKeyPress(key, time) {
		this.log[this.log_count] = {key: key, onTime: time, offTime: ''};

		this.log_count++;
	}

	releaseKey(key, time) {
		if(this.active_count > 0) {
			var ind = arrayFindIndex(this.active, key);

			// If key is pressed
			if(ind !== -1) {
				this.active.splice(ind, 1);
				this.active_count--;

				this.logKeyRelease(key, time);
			}
		}
	}

	logKeyRelease(key, time) {
		var i = 0;
		for(; i < this.log_count; i++) {
			var entry = this.log[this.log_count - (i + 1)];

			if(entry.key === key && entry.offTime === '') {
				entry.offTime = time;
				this.log[i] = entry;
				break;
			}
		}
	}

	update(key, pressed, time) {
		// If key is being pressed
		if(pressed) {
			this.pressKey(key, time);
		}
		// If key is being released
		else {
			this.releaseKey(key, time);
		}
	}

	renderPressed() {
		var pressed = this.active.map((key, index) => {
			return (
				<div className = "pressedKey" key = {key}>
					{key}
				</div>
			)
		});

		return (
			<div id = "PressedKeys">
				<b> Pressed </b>
				{pressed}
			</div>
		);
	}

	renderLogged() {
		var keyLogs = [];

		if(this.log_count > 0) {
			var i = 0;
			for(; i < Math.min(3, this.log_count); i++) {
				var l = this.log[this.log_count - (i + 1)];
				keyLogs.push(<KeyLog key = {"keylog_" + i} pressedKey = {l.key} onTime = {l.onTime} offTime = {l.offTime}/>);
			}
		}

		return (
			<div id = "KeyLogs">
				{keyLogs}
			</div>
		);
	}
}

class Macro {
	constructor(name, icon, segments) {
		this.name = name;
		this.icon = icon;

		this.state = MacroStates.INACTIVE;

		this.onWait = false;
		this.waitTimeout = null;

		this.runner = null;

		this.segments = segments;

		this.totalSteps = 0;
		this.currentOverallStep = 0;

		var i;
		for(i = 0; i < this.segments.length; i++) {
			var segment = this.segments[i];

			var subTotal = 0;

			var j;
			for(j = 0; j < segment.macro.length; j++) {
				var step = segment.macro[j];

				subTotal += step.count;
			}

			this.totalSteps += subTotal * segment.count;
		}
	}

	progress() {
		if(this.totalSteps === 0) return 0;

		return this.currentOverallStep / this.totalSteps;
	}

	startRunner() {
		var f = function* () {
			this.currentOverallStep = 0;

			var info = {state : this.state, abort : false};

			// For each Segment of the Macro
			var i = 0;
			for(; i < this.segments.length; i++) {
				var segment = this.segments[i];

				var steps = segment.macro;
				var reps  = segment.count;

				// For each Repetition of the Segment
				var j = 0;
				for(; j < reps; j++) {

					// For each Step of the Segment
					var k = 0;
					for(; k < steps.length; k++) {

						// If play has not been pressed or has been paused
						while(this.state !== MacroStates.PLAYING) {
							info = yield undefined; // Yield

							if(info.abort) return;

							this.state = info.state;
						}

						// Get current Step
						var step = steps[k];

						// Make the response to the App
						var res = { button : step.button, pressed : true, time : 0};

						// For each repetition of the Step
						var l = 0;
						for(l = 0; l < step.count; l++) {
							res.pressed = true; // Signal that the button is pressed

							// Set timer for the duration of the button press
							this.wait(Math.max(step.onTime, 20));

							res.time = step.onTime;

							yield res;

							// Wait
							while(this.onWait) {
								info = yield undefined;
								if(info.abort) return;
								this.state = info.state;
							}

							res.pressed = false; // Signal the the button is not pressed

							// Set timer for the wait before pressing the next button
							this.wait(Math.max(step.offTime, 20));

							res.time = step.offTime;

							yield res;

							// Wait for timer to elapse and to not be paused
							while(this.onWait || this.state === MacroStates.PAUSED) {
								info = yield undefined;
								if(info.abort) return;
								this.state = info.state;
							}

							this.currentOverallStep++;
						}
					}
				}
			}
			return;
		};

		// Create the Coroutine
		this.runner = coroutine(f, this);
	}

	wait(duration) {
		this.waitTimeout = setTimeout(this.resume, duration, this);
		this.onWait = true;
	}

	resume(obj) {
		obj.onWait = false;
	}

	reset() {
		this.state = MacroStates.INACTIVE;

		if(this.onWait) {
			this.onWait = false;

			clearTimeout(this.waitTimeout);

			this.waitTimeout = null;
		}

		this.currentOverallStep = 0;

		if(this.runner !== null) {
			this.runner({state : this.state, abort : true});

			this.runner = null;
		}
	}

	toString() {
		let text = "Macro - \n";

		let i = 0;
		for(; i < this.segments.length; i++) {
			let seg = this.segments[i];

			text += "\t" + seg.name + " x" + seg.count.toString() + "\n";
		}

		return text;
	}
}

class MacroPlayer {
	constructor() {
		this.state = { selectedMacro : 0,
			playState     : 0,
			macroProgress : 0,
			loadConcluded : false
		};

		// Create JSON Manager
		this.jsonManager = new JSONManeger();

		// Create Macro Builders
		this.builders = [];
		this.builders[0] = new TimeSkipMacroBuilder(this.jsonManager);
		this.builders[1] = new TimeSkipMacroBuilder(this.jsonManager);
		this.builders[2] = new TimeSkipMacroBuilder(this.jsonManager);
		this.builders[3] = new TimeSkipMacroBuilder(this.jsonManager);
		this.builders[4] = new TimeSkipMacroBuilder(this.jsonManager);
		this.builders[5] = new TimeSkipMacroBuilder(this.jsonManager);
		this.builders[6] = new TimeSkipMacroBuilder(this.jsonManager);

		let macroCount = this.builders.length;

		// Init Dirty Bit Array
		this.dirtyMacro = Array(macroCount).fill(false);

		// Init Macro Array
		this.macros = Array(macroCount).fill(null);

		this.selectMacro = this.selectMacro.bind(this);
		this.changeParameter = this.changeParameter.bind(this);
	}

	checkLoadConcluded() {
		var concluded = this.jsonManager.loadConcluded;

		if(!concluded) return;

		var i = 0;
		for(; i < this.builders.length; i++) {
			this.buildMacro(i); // Build macro

			if(this.macros[i] === null || this.macros[i] === undefined) {
				concluded = false;
			}
		}

		this.state.loadConcluded = concluded;
	}

	selectMacro(index) {
		if(this.state.selectedMacro === index) return;

		var audio = new Audio("/click.mp3");
		audio.play();

		var currentMacro = this.macros[this.state.selectedMacro];

		if(currentMacro.state !== MacroStates.INACTIVE) {
			currentMacro.reset();

			this.state.playState = MacroStates.INACTIVE;
			this.state.macroProgress = 0;
		}

		this.state.selectedMacro = index;
	}

	changeParameter(key, value) {
		let builder = this.builders[this.state.selectedMacro];

		if(builder.changeParameter(key, value)) {
			this.dirtyMacro[this.state.selectedMacro] = true;
		}
	}

	play() {
		var index = this.state.selectedMacro;

		var currentMacro = this.macros[index];
		var isDirty      = this.dirtyMacro[index];

		switch(currentMacro.state) {
			default:
			case MacroStates.PLAYING:
			case MacroStates.PAUSED:
			break;

			case MacroStates.INACTIVE:
			case MacroStates.FINISHED:
				if(currentMacro.state === MacroStates.FINISHED) {
					currentMacro.reset();
				}

				if(isDirty) {
					this.dirtyMacro[index] = false;

					this.buildMacro(index);
				}

				currentMacro.startRunner();
			break;
		}

		currentMacro.state = MacroStates.PLAYING;

		this.state.playState = MacroStates.PLAYING;

		return true;
	}

	pause() {
		var currentMacro = this.macros[this.state.selectedMacro];

		if(currentMacro.state === MacroStates.PLAYING) {
			currentMacro.state = MacroStates.PAUSED;

			this.state.playState = MacroStates.PAUSED;

			return true;
		}

		return false;
	}

	reset() {
		var currentMacro = this.macros[this.state.selectedMacro];

		if(currentMacro.state !== MacroStates.INACTIVE) {
			currentMacro.reset();

			this.state.playState = MacroStates.INACTIVE
			this.state.macroProgress = 0;

			return true;
		}

		return false;
	}

	getMacroState() {
		return { macroState : this.state.playState,
				macroProgress : this.state.macroProgress };
	}

	getAllMacroData() {
		let dataArray = [];

		let i = 0;
		for(; i < this.builders.length; i++) {
			let builder = this.builders[i];

			dataArray[i] = builder.getRenderData();
		}

		return dataArray;
	}

	getCurrentMacroData() {
		var builder = this.builders[this.state.selectedMacro];

		return builder.getRenderData();
	}

	buildMacro(index) {
		var builder = this.builders[index];

		var macro = builder.build(this.parameters);

		this.macros[index] = macro;

		console.log(macro.toString());
	}

	updateMacros() {
		var i = 0;
		for(; i < this.macroBuilders.length; i++) {
			var dirty   = this.macroParamsDirty[i];

			if(dirty) {
				this.buildMacro(i);

				this.macroParamsDirty[i] = false;
			}
		}
	}

	update() {
		var response = undefined;

		if(!this.state.loadConcluded) {
			this.checkLoadConcluded();
		}

		// If Load has been completed
		if(this.state.loadConcluded) {
			var runResult = undefined;

			// Get current Macro
			var currentMacro = this.macros[this.state.selectedMacro];

			if(currentMacro === undefined || currentMacro === null) {
				return;
			}

			//console.log(currentMacro.state);
			switch(currentMacro.state) {
				default:
				case MacroStates.INACTIVE:
				case MacroStates.FINISHED:
				return;

				case MacroStates.PLAYING:
					runResult = currentMacro
						.runner({state : currentMacro.state, abort : false});
				break;

				case MacroStates.PAUSED:
					runResult = currentMacro
						.runner({state : currentMacro.state, abort : false});
				break;
			}

			// If a result was obtained
			if(runResult !== undefined) {
				// If the result includes a value
				if(runResult.value !== undefined) {
					response = runResult.value;
				}

				if(runResult.done) currentMacro.state = MacroStates.FINISHED;
			}

			this.state.playState = currentMacro.state;
			this.state.macroProgress = currentMacro.progress() * 100;
		}

		return response;
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.onButtonEvent   = this.onButtonEvent.bind(this);
		this.selectMacro     = this.selectMacro.bind(this);
		this.parameterChange = this.parameterChange.bind(this);

		this.macroPlayer = new MacroPlayer();

		this.keyLogger = new KeyLogger();
		this.currentTime = 0;

		this.state = {selectedMacro :  0,
					  macroState    : -1,
					  macroProgress :  0,
					  locked        : false
		};
	}

	componentDidMount() {
		this.UpdateTimerId = setInterval(
			() => this.update(),
			20
		);
	}

	componentWillUnmount() {
		clearInterval(this.UpdateTimerId);
	}

	update() {
		this.currentTime += 20;

		var res = this.macroPlayer.update(this.currentTime);

		this.setState(this.macroPlayer.getMacroState());

		if(res !== undefined) {
			this.handleSwitchKeys(res.button, res.pressed);
			this.keyLogger.update(res.button, res.pressed, res.time);
		}
	}

	onButtonEvent(name, pressed) {
		var audio = new Audio("/click.mp3");

		if(pressed) {
			audio.play();
		}

		switch (name) {
			default:
			return;

			case "play":
				this.macroPlayer.play();
			break;

			case "pause":
				this.macroPlayer.pause();
			break;

			case "reset":
				if(this.macroPlayer.reset()) {
					this.keyLogger.clear();
				}
			break;
		}

		this.setState(this.macroPlayer.getMacroState());
	}

	selectMacro(index) {
		this.macroPlayer.selectMacro(index);
	}

	parameterChange(key, value) {
		this.macroPlayer.changeParameter(key, value);
	}

	handleSwitchKeys(name, pressed) {
		if(window.joyconJS === undefined) return;

		if(name === "minus") {
			window.joyconJS.onMinus(pressed);
		}

		if(name === "left-stick") {
			window.joyconJS.onLeftJoystickPressed(pressed);
		}

		if(name === "up") {
			window.joyconJS.onUp(pressed);
		}

		if(name === "right") {
			window.joyconJS.onRight(pressed);
		}

		if(name === "down") {
			window.joyconJS.onDown(pressed);
		}

		if(name === "left") {
			window.joyconJS.onLeft(pressed);
		}

		if(name === "lsl") {
			window.joyconJS.onLeftSL(pressed);
		}

		if(name === "lsr") {
			window.joyconJS.onLeftSR(pressed);
		}

		if(name === "plus") {
			window.joyconJS.onPlus(pressed);
		}

		if(name === "a") {
			window.joyconJS.onA(pressed);
		}

		if(name === "b") {
			window.joyconJS.onB(pressed);
		}

		if(name === "x") {
			window.joyconJS.onX(pressed);
		}

		if(name === "y") {
			window.joyconJS.onY(pressed);
		}

		if(name === "rsl") {
			window.joyconJS.onRightSL(pressed);
		}

		if(name === "rsr") {
			window.joyconJS.onRightSR(pressed);
		}

		if(name === "right-stick") {
			window.joyconJS.onRightJoystickPressed(pressed);
		}

		if(name === "home") {
			window.joyconJS.onHome(pressed);
		}
	}

	renderMacros() {
		if(!this.macroPlayer.state.loadConcluded) return (<b> Loading </b>);

		let selected = this.macroPlayer.state.selectedMacro;

		let data = this.macroPlayer.getAllMacroData();

		let index = -1;

		return data.map((entry) => {
				index++;

				var isSelected = selected === index;

				return (
					<MacroButton key = {"macro_" + index.toString()} index = {index}
						selected = {isSelected} name = {entry.name} src = {entry.icon}
						clickHandler = {this.selectMacro}/>
				);
			}
		);
	}

	renderParameters() {
		if(!this.macroPlayer.state.loadConcluded) return (<b> Loading </b>);

		let data = this.macroPlayer.getCurrentMacroData();

		return (
			<ParameterInput key = {"macroParams"}
				macro = {data.name} parameters = {data.parameters}
				eventHandler = {this.parameterChange}/>
		);
	}

	render() {
		const pressed = this.keyLogger.renderPressed();
		const logging = this.keyLogger.renderLogged();

		const macros = this.renderMacros();
		const parameters = this.renderParameters();

		return (
			<div className = "App" style = {{backgroundImage: "url(./images/background.png)"}}>
				<div className = "App-header">
					<img className = "icon" src = "./images/macro_app_icon.png" alt = "AppIcon"/>
					<b className = "App-title"
						style = {{color: "black"}}> POKÉMACROS </b>
				</div>
				<div id = "body">
					<div id = "Macros">
							{macros}
					</div>
					<div id = "Parameters">
							{parameters}
					</div>
					<div id = "Tracker">
						<ProgressBar key = "progressbar" percentage = {this.state.macroProgress} />
						<div id = "KeyLogging">
							{pressed}
							{logging}
						</div>
					</div>
					<div id = "PlayerButtons">
						<button key = "reset" className = "player-button" id = "Reset"
							onMouseDown  = {e => this.onButtonEvent("reset", true)}
							onMouseUp    = {e => this.onButtonEvent("reset", false)}
							onTouchStart = {e => this.onButtonEvent("reset", true)}
							onTouchEnd   = {e => this.onButtonEvent("reset", false)}>
							Reset
						</button>
						<button key = "play" className = "player-button" id = "Play"
							onMouseDown  = {e => this.onButtonEvent("play", true)}
							onMouseUp    = {e => this.onButtonEvent("play", false)}
							onTouchStart = {e => this.onButtonEvent("play", true)}
							onTouchEnd   = {e => this.onButtonEvent("play", false)}>
							Play
						</button>
						<button key = "pause" className = "player-button" id = "Pause"
							onMouseDown  = {e => this.onButtonEvent("pause", true)}
							onMouseUp    = {e => this.onButtonEvent("pause", false)}
							onTouchStart = {e => this.onButtonEvent("pause", true)}
							onTouchEnd   = {e => this.onButtonEvent("pause", false)}>
							Pause
						</button>
					</div>
					<button key = "testA" className = "player-button" id = "testA"
						onMouseDown  = {e => this.handleSwitchKeys("a", true)}
						onMouseUp    = {e => this.handleSwitchKeys("a", false)}
						onTouchStart = {e => this.handleSwitchKeys("a", true)}
						onTouchEnd   = {e => this.handleSwitchKeys("a", false)}>
						A
					</button>
				</div>
			</div>
		);
	}
}

export default App;
