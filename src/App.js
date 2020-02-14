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

async function LoadJson(path) {
	var res = null;

	res = await fetch(path).then(response => { return response.json(); } );

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
			<input type = "date" className = "date-input" readOnly = {this.props.readonly}
			value = {this.props.date} onChange = {this.handleChange}/>
		);
	}
}

class ParameterInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {active : false, locked : false};
	}

	render() {
		var macro = '';

		var readonly = (!this.props.active || this.props.locked);

		var params = this.props.parameters;

		switch(this.props.macro) {
			default:
			break;

			case 0:
				macro = (
					<div className = "macro-parameters" id = "TimeSkipParams">
						<label className = "parameter">
							Start Date
							<DateInput id = "startDate" name = "start-date"
								date = {params.startDate}
								onChange = {date => this.props.eventHandler("startDate", date)}
								readonly = {readonly}/>
						</label>
						<label className = "parameter">
							End Date
							<DateInput id = "endDate" name = "end-date"
								date = {params.endDate}
								onChange = {date => this.props.eventHandler("endDate", date)}
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

		this.daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		this.startDate = 0;
		this.endDate   = 0;

		this.currentDate = 0;

		this.macro = 0;
		this.macroJSON = [];

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
		}
	}

	getMacro(key) {
		var copy = JSON.parse(JSON.stringify(this.loaded[key]));
		return copy;
	}

	concatToMacro(segment) {
		this.macroJSON = this.macroJSON.concat(segment);
	}

	isLeapYear(year) {
		if(year % 4 === 0) {
			if(year % 100 !== 0 || year % 400 === 0) {
				return true;
			}
		}

		return false;
	}

	AdvanceDay(days = 1) {
		var macro = this.getMacro("AdvDay");

		macro.count = days;

		return macro;
	}

	AdvanceMonth(days = 31) {
		var macro = this.getMacro("AdvMonth");

		var segment = macro[0];

		segment.count = days;
		macro[0] = segment;

		return macro;
	}

	InitMacro() {
		// If the day after the start is in the next Month
		if(this.startDate.getMonth() < this.currentDate.getMonth()) {
			// If the day after the start is in the next Year
			if(this.startDate.getFullYear() < this.currentDate.getFullYear()) {
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
	}

	NextMacroStep() {
		var cYear  = this.currentDate.getFullYear();
		var cMonth = this.currentDate.getMonth();
		var cDay   = this.currentDate.getDate();

		var eYear  = this.endDate.getFullYear();
		var eMonth = this.endDate.getMonth();
		var eDay   = this.endDate.getDate();

		var daysToGo = 0;

		// If Target Year has been reached
		if(cYear === eYear) {
			// If Target Month has been reached
			if(cMonth === eMonth) {
				daysToGo = eDay - cDay;

				this.concatToMacro(this.AdvanceDay(daysToGo));

				this.currentDate.setDate(cDay + daysToGo);
			}

			// Not at Target Month and at the start of a Month
			else if(cDay === 1){
				let i = cMonth;
				for(; i < eMonth; i++) {
					daysToGo = this.daysInMonth[i];

					this.macro.concat(this.AdvanceMonth(daysToGo));

					this.currentDate.setDate(cDay + daysToGo);
				}
			}

			// Not at Target Month and not at the start of a Month
			else {
				daysToGo = this.daysInMonth[cMonth] - cDay + 1;

				this.macro.concat(this.AdvanceMonth(daysToGo));

				this.currentDate.setDate(cDay + daysToGo);
			}
		}

		// Not at Target Year and at the start of a Month
		else if(cDay === 1){
			// If it's January
			if(cMonth === 0) {
				// If it's a Leap Year
				if(this.isLeapYear(cYear)) {
					this.concatToMacro(this.getMacro("AdvYearLp"));

					this.currentDate.setDate(cDay + 366);
				}

				// If Not
				else {
					this.concatToMacro(this.getMacro("AdvYear"));

					this.currentDate.setDate(cDay + 365);
				}
			}

			// If it's December
			else if(cMonth === 11) {
				this.concatToMacro(this.getMacro("AdvDec"));

				this.currentDate.setDate(cDay + 31);
			}

			// Other Months
			else {
				let i = cMonth;
				for(; i < 11; i++) {
					daysToGo = this.daysInMonth[i];

					// If it's February and not a Leap Year
					if(i === 1 && !this.isLeapYear(cYear)) {
						daysToGo -= 1;
					}

					this.concatToMacro(this.AdvanceMonth(daysToGo));

					this.currentDate.setDate(cDay + daysToGo);
				}
			}
		}

		// Not Target Year and not at the start of next Month
		else {
			// If it is December
			if(cMonth === 11) {
				var macro = this.getMacro("AdvDec");

				var segment = macro[0];
				segment.count = 31 - cDay;
				macro[0] = segment;

				this.concatToMacro(macro);
			}

			// Any other Month
			else {
				daysToGo = this.daysInMonth[cMonth] - cDay;

				this.concatToMacro(this.AdvanceMonth(daysToGo));

				this.currentDate.setDate(cDay + daysToGo);
			}
		}
	}

	build(sd, ed) {
		if(!this.loadConcluded) return null;

		this.macroJSON = [];

		this.startDate = new Date(sd);
		this.endDate   = new Date(ed);

		this.currentDate = new Date(sd);
		this.currentDate.setDate(this.currentDate.getDate() + 1);

		this.InitMacro();

		// While end Date has not been reached
		while(this.currentDate < this.endDate) {
			this.NextMacroStep();
		}

		this.macro = new Macro("Time Skip", "./images/timeskip_icon.png", this.macroJSON);

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
}

class MacroPlayer {
	constructor() {
		this.state = { selectedMacro : 0,
			playState     : 0,
			macroProgress : 0,
			loadConcluded : false
		};

		var today = new Date();
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		this.parameters = {
			startDate : ConvertDate(today),
			endDate   : ConvertDate(tomorrow)
		};

		this.macroBuilders = [];
		this.macroBuilders[0] = new TimeSkipMacroBuilder();
		this.macroParamsDirty = [false];

		this.macros = Array(this.macroBuilders.length).fill(null);
	}

	checkLoadConcluded() {
		var concluded = true;

		var i = 0;
		for(; i < this.macroBuilders.length; i++) {
			var builder = this.macroBuilders[i];

			// If builder is not fully loaded
			if(!builder.loadConcluded) {
				concluded = false;
				return;
			}

			// If it has loaded
			else {
				// If macro has not been built
				if(this.macros[i] === null) {
					this.buildMacro(i); // Build macro
				}
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
		switch(key) {
			default:
			return;

			case "startDate":
				this.onStartDateChange(value);
				this.macroParamsDirty[0] = true;
			break;

			case "endDate":
				this.onEndDateChange(value);
				this.macroParamsDirty[0] = true;
			break;
		}
	}

	onStartDateChange(newDate) {
		if(this.parameters.startDate !== newDate) {
			var startDate = new Date(newDate);
			var endDate   = new Date(this.parameters.endDate);

			this.parameters.startDate = newDate;

			if(startDate >= endDate) {
				endDate = new Date(startDate.getTime());
				endDate.setDate(endDate.getDate() + 1);

				this.parameters.endDate = ConvertDate(endDate);
			}
		}
	}

	onEndDateChange(newDate) {
		if(this.state.endDate !== newDate) {
			var endDate   = new Date(newDate);
			var startDate = new Date(this.parameters.startDate);

			this.parameters.endDate = newDate;

			if(startDate >= endDate) {
				startDate = new Date(endDate.getTime());
				startDate.setDate(startDate.getDate() - 1);

				this.parameters.startDate = ConvertDate(startDate);
			}
		}
	}

	play() {
		var index = this.state.selectedMacro;

		var currentMacro = this.macros[index];

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

				if(this.macroParamsDirty[index]) {
					this.macroParamsDirty[index] = false;

					var builder = this.macroBuilders[index];

					currentMacro = builder
						.build(this.parameters.startDate,
								this.parameters.endDate);

					this.macros[0] = currentMacro;
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
			console.log("paused");
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

	getMacrosRenderData() {
		var renderData = [];

		var i = 0;
		for(; i < this.macros.length; i++) {
			var macro = this.macros[i];

			renderData[i] = {
				name : macro.name,
				icon : macro.icon,
				parameters : this.parameters
			};
		}

		return renderData;
	}

	buildMacro(index) {
		var builder = this.macroBuilders[index];

		switch(index) {
			default:
			return;

			case 0: // Time Skip
				this.macros[0] = builder
					.build(this.parameters.startDate,
							this.parameters.endDate);
			break;
		}
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

			if(currentMacro === undefined) {
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

		var macros = this.macroPlayer.getMacrosRenderData();

		var render = [];

		var i = 0;
		for(; i < macros.length; i++) {
			let macro = macros[i];

			let selected = this.macroPlayer.state.selectedMacro === i;

			let style = {background : "white"};
			if(selected) style = {background : "black"};

			render[i] = (
				<div key = {"macro_" + i} className = "macro">
					<div key = {"macroButton_" + i} className = "macro-button" id = {macro.name}
						style = {style} onClick = {e => this.selectMacro(i)}>
						<img className = "icon" src = {macro.icon} alt = {"Icon" + macro.name}/>
						{macro.name}
					</div>
					<ParameterInput key = {"macroParams_" + i}
						active = {selected} locked = {this.state.locked}
						macro = {i} parameters = {macro.parameters}
						eventHandler = {this.parameterChange}/>
				</div>
			);
		}

		return render;
	}

	render() {
		const pressed = this.keyLogger.renderPressed();
		const logging = this.keyLogger.renderLogged();

		const macros = this.renderMacros();

		return (
			<div className = "App" style = {{backgroundImage: "url(./images/background.png)"}}>
				<div className = "App-header">
					<img className = "icon" src = "./images/macro_app_icon.png" alt = "AppIcon"/>
					<b className = "App-title"
						style = {{color: "black"}}> POKÉMACROS </b>
				</div>
				<div id = "body">
					{macros}
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
