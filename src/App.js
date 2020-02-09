import React, { Component } from 'react';
import './App.css';

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
	return date.toISOString().slice(0,10);
}

function LoadJson(path) {
	var res = null;

	fetch(path)
		.then(response => response.json())
		.then(json => res = json);

	return res;
}

// React Components
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
			<b> {props.pressedKey} </b>
			<b> {props.onTime} </b>
			<b> {props.offTime} </b>
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
			<input type = "date" className = "date-input" readOnly = {this.props.readonly}
			value = {this.props.date} onChange = {this.handleChange}/>
		);
	}
}

class ParameterInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {active : false, locked : false};

		this.handleSDChange = this.handleSDChange.bind(this);
		this.handleEDChange = this.handleEDChange.bind(this);
	}

	handleSDChange(date) {
		this.props.onStartDateChange(date);
	}

	handleEDChange(date) {
		this.props.onEndDateChange(date);
	}

	render() {
		var macro = '';

		var readonly = (!this.props.active || this.props.locked);

		switch(this.props.macro) {
			default:
			break;

			case 0:
				macro = (
					<div className = "macro-parameters" id = "TimeSkipParams">
						<label className = "parameter">
							Start Date
							<DateInput id = "startDate" name = "start-date"
								date = {this.props.startDate} onChange = {this.handleSDChange}
								readonly = {readonly}/>
						</label>
						<label className = "parameter">
							End Date
							<DateInput id = "endDate" name = "end-date"
								date = {this.props.endDate} onChange = {this.handleEDChange}
								readonly = {readonly}/>
						</label>
					</div>
				);
			break;

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

		return macro;
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

class TimeSkipMacroBuilder {
	constructor() {
		this.filename = {
			FstSkipD  = "FirstDaySkip.json",
			FstSkipM  = "FirstDayMonthSkip.json",
			FstSkipY  = "FirstDayMonthYearSkip.json",
			AdvDay    = "AdvanceDay.json",
			AdvMonth  = "AdvanceMonth.json",
			AdvYear   = "AdvanceYear.json",
			AdvDec    = "AdvanceDecember.json",
			AdvYear   = "AdvanceYear.json",
			AdvYearLp = "AdvanceYearLeap.json"
		}

		this.loaded = {
			FstSkipD  = "",
			FstSkipM  = "",
			FstSkipY  = "",
			AdvDay    = "",
			AdvMonth  = "",
			AdvYear   = "",
			AdvDec    = "",
			AdvYear   = "",
			AdvYearLp = ""
		}

		this.daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	}

	isLeapYear(year) {
		if(year % 4 === 0) {
			if(year % 100 !== 0 || year % 400 === 0) {
				return true;
			}
		}

		return false;
	}

	determineFirstSegments(firstDay, secondDay) {
		segments = [];

		if(firstDay.getMonth() < secondDay.getMonth()) {
			if(firstDay.getFullYear() < secondDay.getFullYear()) {
				segments.push(getMacro("FstSkipY"));
			}
			else {
				segments.push(getMacro("FstSkipM"));
			}
		}
		else {
			segments.push(getMacro("FstSkipD"));
		}

		return segments;
	}

	AdvanceDay(days = 1) {
		macro = getMacro("AdvDay");

		macro.count = days;

		return macro;
	}

	AdvanceMonth(days = 31) {
		macro = getMacro("AdvMonth");

		macro.count = days;

		return macro;
	}

	build(sd, ed) {
		var segments = [];

		var startDate = new Date(sd);
		var endDate   = new Date(ed);

		var eYear  = endDate.getFullYear();
		var eMonth = endDate.getMonth();
		var eDay   = endDate.getDate();

		var currentDate = new Date(sd);
		currentDate.setDate(currentDate.getDate() + 1);

		segments.concat(determineFirstSkip(startDate, currentDate));

		// While end Date has not been reached
		while(currentDate < endDate) {
			var macro = "";

			var cYear  = currentDate.getFullYear();
			var cMonth = currentDate.getMonth();
			var cDay   = currentDate.getDate();

			// If Target Year has been reached
			if(cYear === eYear) {
				// If Target Month has been reached
				if(cMonth === eMonth) {
					var daysToGo = eDay - cDay;

					segments.push(AdvanceDay(daysToGo));
					currentDate.setDate(currentDate.getDate() + daysToGo);
				}

				// Not at Target Month
				else {
					var i = cMonth;
					for(; i < eMonth; i++) {
						var daysToGo = this.daysInMonth[i];
						segments.push(AdvanceMonth(daysToGo));
						currentDate.setDate(currentDate.getDate() + daysToGo);
					}
				}
			}

			// Not at Target Year
			else {
				// If it's January
				if(cMonth === 0) {
					// If it's a Leap Year
					if(isLeapYear(cYear)) {
						segments.push(getMacro("AdvYearLp"));
						currentDate.setDate(currentDate.getDate() + 366);
					}

					// If Not
					else {
						segments.push(getMacro("AdvYear"));
						currentDate.setDate(currentDate.getDate() + 365);
					}
				}

				// If it's December
				else if(cMonth === 11) {
					segments.push(getMacro("AdvDec"));
					currentDate.setDate(currentDate.getDate() + 31);
				}

				// Other Months
				else {
					var i = cMonth;
					for(; i < 11; i++) {
						var daysToGo = this.daysInMonth[i];

						// If it's February and not a Leap Year
						if(i === 1 && !isLeapYear(cYear)) {
							daysToGo -= 1;
						}

						segments.push(AdvanceMonth(daysToGo));
						currentDate.setDate(currentDate.getDate() + daysToGo);
					}
				}
			}

			// If it is the 1st of the Month
			if(cDay === 1) {
				// If it is January
				if(cMonth === 0) {
					// If end Date is not this Year
					if(cYear < eDate.getFullYear()) {
						macro = "AdvYear";
						if(isLeapYear(cYear)) macro = "AdvYearLp";

						segments.push(getMacro(macro));

						currentDate.setFullYear(currentDate.getFullYear() + 1);
					}
				}

				// If it is another Month
				else {
					var i = cMonth;
					for(; i < 12; i++) {
						segments.push(advanceMonth(i, cYear));
					}
				}
			}
		}
	}

	getMacro(key) {
		var macro = this.loaded[key];

		if(macro === "") {
			macro = LoadJson("./macros/" + this.filename[key]);
			this.loaded[key] = macro;
		}

		return macro;
	}
}

function BuildTimeSkipMacro(startDate, endDate) {
	var paths = [];
	var reps  = [];

	var pbs = { macro_folder : "./macros/", skipfirst : "SkipFirst",
	advance : "Advance", day : "Day", month : "Month", year : "Year", json : ".json" }

	var daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	var sDate = new Date(startDate);
	var eDate = new Date(endDate);

	// First skip
	paths[0] = pbs.macro_folder + pbs.skipfirst + pbs.day;

	var sDate_p1 = new Date(startDate);
	sDate_p1.setDate(sDate_p1.getDate() + 1);

	if(sDate.getMonth() < sDate_p1.getMonth()) {
		paths[0] += pbs.month;

		if(sDate.getFullYear() < sDate_p1.getFullYear()) {
			paths[0] += pbs.year;
		}
	}

	paths[0] += pbs.json;
	reps[0]   = 1;

	// Suvsequent skips
	var cDate = sDate_p1;
	var index = 1;

	while(cDate < eDate) {
		paths[index] = pbs.macro_folder + pbs.advance + pbs.day;

		var cYear  = cDate.getFullYear();
		var cMonth = cDate.getMonth();
		var cDay   = cDate.getDate();

		// If we are in the target Year and Month
		if(cYear === eDate.getFullYear() && cMonth === eDate.getMonth()) {
			reps[index] = eDate.getDate() - cDay;
		}
		else {
			var leap_year = true;

			// If it's February check for Leap Year
			if(cMonth === 2) {
				leap_year = cYear % 4 === 0 && (cYear % 100 !== 0 || cYear % 400 === 0);
			}

			// Calculate # of days to the end of the Month
			reps[index] = daysInMonth[cMonth] - (cDay - 1);
			if(leap_year) reps[index] -= 1;

			// Add that segment to the macro
			paths[index] += pbs.json;
			index++;

			// Add skip for last day of the month to first of the next
			paths[index] = pbs.macro_folder + pbs.advance + pbs.day + pbs.month;
			reps[index]  = 1;

			// If it is December signal year skip
			if(cMonth === 11) {
				paths[index] += pbs.year;
			}
		}

		paths[index] += pbs.json; // Finish path to macro segment
		cDate.setDate(cDay + reps[index - 1] + 1); // Advance date
		index++;
	}

	console.log(paths);
	console.log(reps);

	return new Macro("Time Skip", paths, reps);
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
	constructor(name, paths, repetitions) {
		this.name = name;

		this.state = MacroStates.INACTIVE;

		this.onWait = false;
		this.waitTimeout = null;

		this.runner = null;

		this.segments = [];

		this.totalSteps = 0;
		this.currentOverallStep = 0;

		var i;
		for(i = 0; i < paths.length; i++) {
			var path  = paths[i];
			var count = 1;

			if(repetitions !== undefined) {
				count = repetitions[i];
			}

			fetch(path)
				.then(response => response.json())
				.then(json => this.initSegmentInfo(json, count));
		}

		console.log(this.totalSteps);
	}

	initSegmentInfo(json, count) {
		this.segments.push({steps : json, reps : count});

		var sum = json.map((step) => step.count).reduce((a, b) => a + b, 0);

		this.totalSteps = this.totalSteps + sum * count;
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

				var steps = segment.steps;
				var reps  = segment.reps;

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
						var res = { button : step.button, pressed : true };

						// For each repetition of the Step
						var l = 0;
						for(l = 0; l < step.count; l++) {
							res.pressed = true; // Signal that the button is pressed

							// Set timer for the duration of the button press
							this.wait(Math.max(step.onTime, 20));

							yield res;

							// Wait
							while(this.onWait) {
								info = yield;
								if(info.abort) return;
								this.state = info.state;
							}

							res.pressed = false; // Signal the the button is not pressed

							// Set timer for the wait before pressing the next button
							this.wait(Math.max(step.offTime, 20));

							yield res;

							// Wait for timer to elapse and to not be paused
							while(this.onWait || this.state === MacroStates.PAUSED) {
								info = yield;
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
}

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {};

		this.onButtonEvent = this.onButtonEvent.bind(this);

		this.onUseParams = this.onUseParams.bind(this);

		this.onStartDateChange = this.onStartDateChange.bind(this);
		this.onEndDateChange = this.onEndDateChange.bind(this);

		this.macros = [];

		this.keyLogger = new KeyLogger();
		this.currentTime = 0;

		this.selectedMacro = 0;

		var today = new Date();
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		this.macros[0] = BuildTimeSkipMacro(today, tomorrow);
		console.log(this.macros[0]);

		this.state = {selectedMacro : this.selectedMacro,
					  macroState : this.macros[this.selectedMacro].state,
					  macroProgress : 0,
					  useParams : false,
					  locked : false,
					  startDate : ConvertDate(today),
					  endDate : ConvertDate(tomorrow)};
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

		var currentMacro = this.macros[this.selectedMacro];

		this.setState({selectedMacro : this.selectedMacro});
		this.setState({macroState : currentMacro.state});
		this.setState({macroProgress : currentMacro.progress() * 100});

		if(currentMacro.state === MacroStates.FINISHED) return;

		var runner = currentMacro.runner;

		if(runner === null) return;

		var res = runner({state : currentMacro.state, abort : false});

		if(res !== undefined) {
			if(res.value !== undefined) {
				this.handleSwitchKeys(res.value.button, res.value.pressed);
				this.keyLogger.update(res.value.button, res.value.pressed, this.currentTime);
			}

			if(res.done) currentMacro.state = MacroStates.FINISHED;
		}
	}

	setMacro(id) {
		this.selectedMacro = id;

		var currentMacro = this.macros[this.selectedMacro];

		if(currentMacro.state !== MacroStates.INACTIVE) {
			currentMacro.reset();
		}
	}

	onButtonEvent(name, pressed) {
		var audio = new Audio("/click.mp3");

		if(pressed) {
			audio.play();
		}

		var currentMacro = this.macros[this.selectedMacro];

		switch (name) {
			default:
			return;

			case "play":
				switch(currentMacro.state) {
					default:
					case MacroStates.PLAYING:
					case MacroStates.PAUSED:
					break;

					case MacroStates.INACTIVE:
						currentMacro.startRunner();
					break;

					case MacroStates.FINISHED:
						currentMacro.reset();

						currentMacro.startRunner();
					break;
				}

				currentMacro.state = MacroStates.PLAYING;

				this.setState({playPressed: pressed});
			break;

			case "pause":
				if(currentMacro.state === MacroStates.PLAYING) {
					currentMacro.state = MacroStates.PAUSED;
				}

				this.setState({pausePressed: pressed});
			break;

			case "reset":
				if(currentMacro.state !== MacroStates.INACTIVE) {
					currentMacro.reset();

					this.keyLogger.clear();
				}

				this.setState({resetPressed: pressed});
			break;
		}

		this.setState({macroState : currentMacro.state});
	}

	onUseParams() {
		var toggle = !this.state.useParams;

		this.setState({ useParams : toggle });
	}

	onStartDateChange(newDate) {
		if(this.state.startDate !== newDate) {
			var startDate = new Date(newDate);
			var endDate   = new Date(this.state.endDate);

			this.setState({startDate : newDate});

			if(startDate >= endDate) {
				endDate = new Date(startDate.getTime());
				endDate.setDate(endDate.getDate() + 1);

				this.setState({endDate : ConvertDate(endDate)});
			}

			this.macros[0] = BuildTimeSkipMacro(this.state.startDate, this.state.endDate);
		}
	}

	onEndDateChange(newDate) {
		if(this.state.endDate !== newDate) {
			var endDate   = new Date(newDate);
			var startDate = new Date(this.state.startDate);

			this.setState({endDate : newDate});

			if(startDate >= endDate) {
				startDate = new Date(endDate.getTime());
				startDate.setDate(startDate.getDate() - 1);

				this.setState({startDate : ConvertDate(startDate)});
			}

			this.macros[0] = BuildTimeSkipMacro(this.state.startDate, this.state.endDate);
		}
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

	render() {
		const macros = this.macros.map((macro, index) => {
			var selected = this.selectedMacro === index;
			var style = (selected ? {background : "black", color : "white"} : {background : "white", color : "black"});
			var images = ["./images/timeskip_icon.png", "./images/timeskip_icon.png"];

			return (
				<div key = {"macro_" + index} className = "macro">
					<div key = {"macroButton_" + index} className = "macro-button" id = {macro.name}
						style = {style} onClick = {e => this.setMacro(index)}>
						<img className = "icon" src = {images[index]} alt = {"Icon" + macro.name}/>
						{macro.name}
					</div>
					<ParameterInput key = {"macroParams_" + index}
						active = {selected} locked = {this.state.locked}
						macro = {index}
						startDate = {this.state.startDate} onStartDateChange = {this.onStartDateChange}
						endDate   = {this.state.endDate}   onEndDateChange   = {this.onEndDateChange} />
				</div>
			)
		});

		const pressed = this.keyLogger.renderPressed();
		const logging = this.keyLogger.renderLogged();

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
					<div id = "Tracker">
						<ProgressBar key = "progressbar" percentage = {this.state.macroProgress} />
						<div id = "KeyLogging">
							{pressed}
							{logging}
						</div>
					</div>
					<div id = "PlayerButtons">
						<button key = "reset" className = "macro-button" id = "Reset"
							onMouseDown  = {e => this.onButtonEvent("reset", true)}
							onMouseUp    = {e => this.onButtonEvent("reset", false)}
							onTouchStart = {e => this.onButtonEvent("reset", true)}
							onTouchEnd   = {e => this.onButtonEvent("reset", false)}>
							Reset
						</button>
						<button key = "play" className = "macro-button" id = "Play"
							onMouseDown  = {e => this.onButtonEvent("play", true)}
							onMouseUp    = {e => this.onButtonEvent("play", false)}
							onTouchStart = {e => this.onButtonEvent("play", true)}
							onTouchEnd   = {e => this.onButtonEvent("play", false)}>
							Play
						</button>
						<button key = "pause" className = "macro-button" id = "Pause"
							onMouseDown  = {e => this.onButtonEvent("pause", true)}
							onMouseUp    = {e => this.onButtonEvent("pause", false)}
							onTouchStart = {e => this.onButtonEvent("pause", true)}
							onTouchEnd   = {e => this.onButtonEvent("pause", false)}>
							Pause
						</button>
					</div>
					<button key = "testA" className = "macro-button" id = "testA"
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
