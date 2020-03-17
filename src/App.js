import React, { Component } from 'react';
import './App.css';

//
// - Constants and Globals
//

const MonthLength = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const MacroStates = {
	INACTIVE: 0,
	PLAYING:  1,
	PAUSED:   2,
	FINISHED: 3
}

//
// - AUX Functions
//

function arrayFindIndex(array, toFind) {
	var found = -1;

	array.forEach((item, i) => {
		if(item === toFind) found = i;
	});

	return found;
}

function ConvertDate(date) {
	let day   = date.getDate().toString();
	if(day <= 9) day = "0" + day;

	let month = (date.getMonth() + 1).toString();
	if(date.getMonth() < 9) month = "0" + month;

	let year  = date.getFullYear().toString();

	return year + "-" + month + "-" + day;
}

async function LoadJson(path) {
	var res = null;

	let url = "https://cdn.jsdelivr.net/gh/Ghoster23/PokemonMacrosJoyConDroid/public/macros/";

	res = await fetch(url + path).then(response => { return response.json(); } );

	return res;
}

//
// - React Components
//

function PlayerButton(props) {
	var divStyle = { background : "#FFF" };
	var iconStyle = {};

	if(props.selected) {
		divStyle  = { background : "#000" };
		iconStyle = { filter : "invert(1)" };
	}

	return (
		<div className = "player-button" id = {props.name} style = {divStyle}
			onClick = {e => props.clickHandler()} >
			<img className = "icon" src = {props.src} alt = {props.name + " Button Icon"}
				style = {iconStyle} />
		</div>
	);
}

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
			<b className = "key-log-cell"> {props.index} </b>
			<b className = "key-log-cell"> {props.pressedKey} </b>
			<b className = "key-log-cell"> {props.onTime} </b>
			<b className = "key-log-cell"> {props.offTime} </b>
		</div>
	);
}

class CheckBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		return this.props.onChange(this.props.paramKey, event.target.checked);
	}

	render() {
		return (
			<input type = "checkbox" checked = {this.props.checked} onChange = {this.handleChange} />
		);
	}
}

/*
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
*/

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

class DropDownList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		if(event.target.value === "") {
			this.props.onChange(0);
			return;
		}

		this.props.onChange(parseInt(event.currentTarget.value));
	}

	renderOptions() {
		return this.props.options.map((string, index) => {
			return (
				<option key = {"option" + index.toString()} value={index}>{string}</option>
			);
		});
	}

	render() {
		let options = this.renderOptions();

		return (
			<select className = "drop-down-list" onChange = {this.handleChange}>
			  {options}
			</select>
		);
	}
}

class ParameterInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {active : false};
	}

	render() {
		var params = this.props.parameters;

		switch(this.props.macro) {
			default:
				return (
					<div className = "macro-parameters" id = "DefaultParams">
					</div>
				);

			case "Time Skip":
				return (
					<div className = "macro-parameters" id = "TimeSkipParams">
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
						<div className = "parameters-entry">
							<label className = "parameter-label">
								Date Format
							</label>
							<div className = "parameter">
								<DropDownList id = "dateFormat" name = "date-format"
									value = {params.dateFormat}
									options = {["World", "US"]}
									onChange = {value => this.props.eventHandler("dateFormat", value)}
								/>
							</div>
						</div>
					</div>
				);

			case "Loto ID":
				return (
					<div className = "macro-parameters" id = "LottoIDParams">
						<div className = "parameters-entry">
							<label className = "parameter-label">
								First Day Loto
							</label>
							<div className = "parameter">
								<CheckBox id = "firstDayLoto" name = "first-day-loto"
									checked = {params.getFirst}
									paramKey = "getFirst"
									onChange = {this.props.eventHandler}
								/>
							</div>
						</div>
						<div className = "parameters-entry">
							<label className = "parameter-label">
								Attempts
							</label>
							<div className = "parameter">
								<IntegerInput id = "Attempts" name = "lotto-id-attempts"
									value = {params.attempts}
									onChange = {value => this.props.eventHandler("attempts", value)}
									min = "0" max = "10000"
								/>
							</div>
						</div>
						<div className = "parameters-entry">
							<label className = "parameter-label">
								Date Format
							</label>
							<div className = "parameter">
								<DropDownList id = "dateFormat" name = "date-format"
									value = {params.dateFormat}
									options = {["World", "US"]}
									onChange = {value => this.props.eventHandler("dateFormat", value)}
								/>
							</div>
						</div>
					</div>
				);

			case "Wonder Box":
				return (
					<div className = "macro-parameters" id = "WonderBoxParams">
						<div className = "parameters-entry">
							<label className = "parameter-label">
								Count
							</label>
							<div className = "parameter">
								<IntegerInput id = "WTradeCount" name = "wonder-trade-count"
									value = {params.count}
									onChange = {value => this.props.eventHandler("count", value)}
									min = "1" max = "30"
								/>
							</div>
						</div>
						<div className = "parameters-entry">
							<label className = "parameter-label">
								Wait Time
							</label>
							<div className = "parameter">
								<IntegerInput id = "WTradeWaitTime" name = "wonder-trade-wait-time"
									value = {params.waitTime}
									onChange = {value => this.props.eventHandler("waitTime", value)}
									min = "2" max = "600"
								/>
							</div>
						</div>
					</div>
				);
		}
	}
}

class InfoOverlay extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		var display_style = {display : "none"};
		if(this.props.show) display_style.display = "flex";

		var sections = [];

		var i = 0;
		for(; i < this.props.sections.length; i++) {
			var section = this.props.sections[i];

			sections[i] = (
				<div className = "infoSection" key = {"infoSect_" + i.toString()}>
					<h2 className = "infoSectionTitle"> {section.title} </h2>
					{section.text}
				</div>
			);
		}

		return (
			<div id = "infoOverlay" className = "info-overlay" style = {display_style}>
				<div id = "infoOverlayOut" onMouseDown  = {this.props.onMouseDown} onTouchStart = {this.props.onTouchStart}>
				</div>
				<div id = "infoTextBox" className = "text-box">
					<h1 className = "infoTextTitle"> {this.props.title} </h1>
						{sections}
				</div>
			</div>
		);
	}
}

//
// - Back End Elements
//

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
		this.segments = {
			FstSkip     : {filename: "FirstSkip.json",                object: ""},
			FstSkipUS   : {filename: "FirstSkipUS.json",              object: ""},
			AdvDay      : {filename: "AdvanceDay.json",               object: ""},
			AdvDayUS    : {filename: "AdvanceDayUS.json",             object: ""},
			LotoID      : {filename: "LotoID.json",                   object: ""},
			Return      : {filename: "ReturnToGameFromSettings.json", object: ""},
			Universal   : {filename: "UniversalSkip.json",            object: ""},
			UniversalUS : {filename: "UniversalSkipUS.json",          object: ""},
			SelectInBox : {filename: "SelectInBox.json",              object: ""},
			StartWonder : {filename: "StartWonderTrade.json",         object: ""},
			EndWonder   : {filename: "ConcludeWonderTrade.json",      object: ""}
		};

		var entries = Object.entries(this.segments);

		this.loadedCount = 0;
		this.segmentCount = entries.length;
		this.loadConcluded = false;

		let i = 0;
		for(; i < this.segmentCount; i++) {
			this.loadMacro(entries[i][0]);
		}
	}

	async loadMacro(key) {
		var segment = this.segments[key];

		segment.object = await LoadJson(segment.filename);

		this.loadedCount += 1;

		if(this.loadedCount === this.segmentCount) {
			this.loadConcluded = true;
			console.log("JSON Load Concluded");
		}
	}

	getMacro(key) {
		var segment = this.segments[key];
		var copy = JSON.parse(JSON.stringify(segment.object));
		return copy;
	}
}

//
// - Macro Builders
//

class MacroBuilder {
	constructor(jsonM, name, icon) {
		this.jsonManager = jsonM;

		this.name = name;
		this.icon = icon;

		this.macro = 0;
		this.macroJSON = [];

		this.parameters = {};
		this.paramHandlers = {};

		this.info = [];
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
			parameters : this.parameters,
			info : this.info
		};
	}
}

class TimeSkipMacroBuilder extends MacroBuilder {
	constructor(jsonM) {
		super(jsonM, "Time Skip", "./images/timeskip_icon.png");

		// Init Parameters
		this.parameters.daysToAdvance = 1;
		this.parameters.dateFormat    = 0;

		this.currentFormat = "";

		this.onDaysToAdvanceChange = this.onDaysToAdvanceChange.bind(this);
		this.onDateFormatChange    = this.onDateFormatChange.bind(this);

		this.paramHandlers = {
			daysToAdvance : this.onDaysToAdvanceChange,
			dateFormat    : this.onDateFormatChange
		};

		var text1 = (
			<p>
				<b>1-</b> In the <b>Console Settings</b>, turn <b>Synchronize Time</b> off.
				<br/>
				<br/>
				<b>2-</b> The <b>Date</b> in <b>Console Settings</b> must be the first of any 31 day month.
				<br/>
				<br/>
				<b>3-</b> Set <b>Skip Count</b> to the number of days to advance.
				<br/>
				<br/>
				<b>4-</b> Set <b>Date Format</b> to match your console's format.
			</p>
		);

		this.info = [
			{
				title: "SetUp",
				text: text1
			},
			{
				title: "How it works",
				text: "The frame of the seed will advance with each time the date is advanced. This means that we can just change the day, with the only downside being that when returning to the first of the month no advancement will happen. The macro takes this into account and adds repetitions so that in the end the correct number of skips is achieved."
			},
			{
				title: "Recommendations",
				text: "Avoid doing many skips in the Wild Area as this is known to sometimes result in game crashes. Use this macro indoors."
			}
		];
	}

	// Parameter Handlers
	onDaysToAdvanceChange(days) {
		if(this.parameters.daysToAdvance !== days) {
			this.parameters.daysToAdvance = days;

			return true;
		}

		return false;
	}

	onDateFormatChange(format) {
		if(this.parameters.dateFormat !== format) {
			this.parameters.dateFormat = format;

			switch(format) {
				default:
				case 0: // WORLD
					this.currentFormat = "";
				break;

				case 1: // US
					this.currentFormat = "US";
				break;
			}

			return true;
		}

		return false;
	}

	// Build Macro
	AdvanceDay(days) {
		var macro = this.getMacro("AdvDay" + this.currentFormat);

		macro[0].count = days;

		this.concatToMacro(macro);
	}

	InitMacro() {
		this.concatToMacro(this.getMacro("FstSkip" + this.currentFormat));
	}

	build() {
		if(!this.jsonManager.loadConcluded) return null;

		this.macroJSON = []; // Clear Macro JSON

		this.InitMacro();

		var count = this.parameters.daysToAdvance;

		// If more than 1 skip
		if(count > 1) {
			let adjust = Math.floor(count / 31);

			if(adjust >= 31) {
				adjust += Math.floor(adjust / 31);
			}

			this.AdvanceDay((count - 1) + adjust);
		}

		this.concatToMacro(this.getMacro("Return"));

		this.macro = new Macro(this.name, this.icon, this.macroJSON);

		return this.macro;
	}
}

class LotoIDMacroBuilder extends MacroBuilder {
	constructor(jsonM) {
		super(jsonM, "Loto ID", "./images/lotoid_icon.png");

		this.parameters.attempts  = 1;
		this.parameters.getFirst  = true;
		this.parameters.dateFormat = 0;

		this.currentFormat = "";

		this.onAttemptsChange = this.onAttemptsChange.bind(this);
		this.onGetFirstChange = this.onGetFirstChange.bind(this);
		this.onDateFormatChange = this.onDateFormatChange.bind(this);

		this.paramHandlers = {
			attempts  : this.onAttemptsChange,
			getFirst  : this.onGetFirstChange
		};

		var text1 = (
			<p>
				<b>1-</b> In the <b>Console Settings</b>, turn <b>Synchronize Time</b> off.
				<br/>
				<br/>
				<b>2-</b> Position the character in front of the PC, facing it.
				<br/>
				<br/>
				<b>3-</b> Check the <b>First Day Loto</b> box only if you have the Loto still available.
				<br/>
				<br/>
				<b>4-</b> Set <b>Attempts</b> to how many times you want to try the Loto.
				<br/>
				<br/>
				<b>5-</b> Set <b>Date Format</b> to the your Switch's region date format.
			</p>
		);

		this.info = [
			{
				title: "SetUp",
				text: text1
			}
		];
	}

	// Parameter Handlers
	onAttemptsChange(count) {
		if(this.parameters.attempts !== count) {
			this.parameters.attempts = count;

			return true;
		}

		return false;
	}

	onGetFirstChange(bool) {
		if(this.parameters.getFirst !== bool) {
			this.parameters.getFirst = bool;

			return true;
		}

		return false;
	}

	onDateFormatChange(format) {
		if(this.parameters.dateFormat !== format) {
			this.parameters.dateFormat = format;

			switch(format) {
				default:
				case 0: // WORLD
					this.currentFormat = "";
				break;

				case 1: // US
					this.currentFormat = "US";
				break;
			}

			return true;
		}

		return false;
	}

	// Build Macro
	AdvanceDate(currentDate) {
		var tomorrow = new SimpleDate(currentDate.toString());
		tomorrow.increment(1);

		// If the day after the start is in the next Month
		if(currentDate.month < tomorrow.month) {
			// If the day after the start is in the next Year
			if(currentDate.year < tomorrow.year) {
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

	build() {
		if(!this.jsonManager.loadConcluded) return null;

		this.macroJSON = []; // Clear Macro JSON

		var counter = 0;

		if(this.parameters.getFirst) {
			this.concatToMacro(this.getMacro("LotoID"));

			counter = 1;
		}

		// While End Date has not been reached
		while(counter < this.parameters.attempts) {
			this.concatToMacro(this.getMacro("Universal" + this.currentFormat));
			counter++;

			this.concatToMacro(this.getMacro("Return"));

			this.concatToMacro(this.getMacro("LotoID"));
		}

		this.macro = new Macro(this.name, this.icon, this.macroJSON);

		return this.macro;
	}
}

class WonderBoxMacroBuilder extends MacroBuilder {
	constructor(jsonM) {
		super(jsonM, "Wonder Box", "./images/wonderbox_icon.png");

		this.parameters.count    = 1;
		this.parameters.waitTime = 25;

		this.onCountChange    = this.onCountChange.bind(this);
		this.onWaitTimeChange = this.onWaitTimeChange.bind(this);

		this.paramHandlers = {
			count  : this.onCountChange,
			waitTime : this.onWaitTimeChange
		};

		var text1 = (
			<p>
				<b>1-</b> In-Game, open your PC and go to the box with the pokemon to be wonder traded.
				<br/>
				<br/>
				<b>2-</b> Make sure there are no empty spots between pokemon.
				The macro will start trading from the top left corner and go left to right, top to bottom.
				<br/>
				<br/>
				<b>3-</b> Exit all menus.
				<br/>
				<br/>
				<b>4-</b> Set the <b>Count</b> parameter to how many pokemon you want to trade away from that box.
				<br/>
				<br/>
				<b>4-</b> Set the <b>Wait Time</b> parameter to how many <b>seconds</b> the macro should wait for the Wonder Trade to complete.
			</p>
		);

		var text2 = (
			<p>
				When running this macro, the time for a trade to go through can vary a lot.
				Because of this, you may need to adjust the <b>Wait Time</b>. It can go up to 10 minutes (600 s),
				or as low as 2 seconds.
				<br/>
				If it is too erratic and you want to be more efficient, you can set the value relatively low and
				press pause after the search for a trade starts and press play to resume the macro when you see
				it has finished.
				<br/>
				<br/>
				It is also very important to make sure you have the correct box selected at the start of the macro.
			</p>
		);

		this.info = [
			{
				title: "SetUp",
				text: text1
			},
			{
				title: "Recommendations",
				text: text2
			}
		];
	}

	// Parameter Handlers
	onCountChange(count) {
		if(this.parameters.count !== count) {
			this.parameters.count = count;

			return true;
		}

		return false;
	}

	onWaitTimeChange(time) {
		if(this.parameters.waitTime !== time) {
			this.parameters.waitTime = time;

			return true;
		}

		return false;
	}

	// Build Macro
	SelectInBox(row, column) {
		var segments = this.getMacro("SelectInBox");

		segments[0].macro[0].count = row;
		segments[0].macro[1].count = column;

		this.concatToMacro(segments);
	}

	ConcludeTrade() {
		var segments = this.getMacro("EndWonder");

		segments[0].macro[2].offTime = this.parameters.waitTime * 1000;

		this.concatToMacro(segments);
	}

	build() {
		if(!this.jsonManager.loadConcluded) return null;

		this.macroJSON = []; // Clear Macro JSON

		var count  = 0;
		var row    = 0;
		var column = 0;

		for(; row < 5; row++) {
			for(column = 0; column < 6; column++) {
				this.concatToMacro(this.getMacro("StartWonder"));

				this.SelectInBox(row, column);

				this.ConcludeTrade();

				count++;
				if(count >= this.parameters.count) {
					break;
				}
			}

			if(count >= this.parameters.count) {
				break;
			}
		}

		this.macro = new Macro(this.name, this.icon, this.macroJSON);

		return this.macro;
	}
}

//
// - APP Components
//

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

		this.totalTime = 0;

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
		this.builders[1] = new LotoIDMacroBuilder(this.jsonManager);
		this.builders[2] = new WonderBoxMacroBuilder(this.jsonManager);

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
		if(this.state.selectedMacro === index) return false;

		var audio = new Audio("/click.mp3");
		audio.play();

		var currentMacro = this.macros[this.state.selectedMacro];

		if(currentMacro.state !== MacroStates.INACTIVE) {
			currentMacro.reset();

			this.state.playState = MacroStates.INACTIVE;
			this.state.macroProgress = 0;
		}

		this.state.selectedMacro = index;

		return true;
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

					currentMacro = this.macros[index];
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

class KeyLogger {
	constructor() {
		this.keys = {
			a               : {pressed : false, pendingLog: null},
			b               : {pressed : false, pendingLog: null},
			x               : {pressed : false, pendingLog: null},
			y               : {pressed : false, pendingLog: null},
			lsl             : {pressed : false, pendingLog: null},
			lsr             : {pressed : false, pendingLog: null},
			rsl             : {pressed : false, pendingLog: null},
			rsr             : {pressed : false, pendingLog: null},
			plus            : {pressed : false, pendingLog: null},
			minus           : {pressed : false, pendingLog: null},
			up              : {pressed : false, pendingLog: null},
			right           : {pressed : false, pendingLog: null},
			left            : {pressed : false, pendingLog: null},
			down            : {pressed : false, pendingLog: null},
			left_stick      : {pressed : false, pendingLog: null},
			right_stick     : {pressed : false, pendingLog: null},
			left_stick_dir  : {pressed : false, pendingLog: null},
			right_stick_dir : {pressed : false, pendingLog: null},
			home            : {pressed : false, pendingLog: null}
		};

		this.log = [];
		this.log_count = 0;
	}

	clear() {
		this.keys = {
			a               : {pressed : false, pendingLog: null},
			b               : {pressed : false, pendingLog: null},
			x               : {pressed : false, pendingLog: null},
			y               : {pressed : false, pendingLog: null},
			lsl             : {pressed : false, pendingLog: null},
			lsr             : {pressed : false, pendingLog: null},
			rsl             : {pressed : false, pendingLog: null},
			rsr             : {pressed : false, pendingLog: null},
			plus            : {pressed : false, pendingLog: null},
			minus           : {pressed : false, pendingLog: null},
			up              : {pressed : false, pendingLog: null},
			right           : {pressed : false, pendingLog: null},
			left            : {pressed : false, pendingLog: null},
			down            : {pressed : false, pendingLog: null},
			left_stick      : {pressed : false, pendingLog: null},
			right_stick     : {pressed : false, pendingLog: null},
			left_stick_dir  : {pressed : false, pendingLog: null},
			right_stick_dir : {pressed : false, pendingLog: null},
			home            : {pressed : false, pendingLog: null}
		};

		this.log = [];
		this.log_count = 0;
	}

	pressKey(key, time) {
		if(key !== "buffer") {
			let info = this.keys[key];

			// If key is not pressed
			if(info.pressed === false) {
				info.pressed = true;

				info.pendingLog = this.addLogEntry(key, time);
			}

			this.keys[key] = info;
		}
	}

	addLogEntry(key, time) {
		let entry = {index: this.log_count, key: key, onTime: time, offTime: ''}

		this.log[this.log_count] = entry;

		this.log_count++;

		return entry;
	}

	releaseKey(key, time) {
		if(key !== "buffer") {
			let info = this.keys[key];

			if(info.pressed === true) {
				info.pressed = false;

				let entry = info.pendingLog;
				info.pendingLog = null;

				entry.offTime = time;

				this.log[entry.index] = entry;
			}
		}
	}

	getPressed() {
		let pressedKeys = [];

		for(let entry in this.keys) {
			let info = this.keys[entry];

			if(info.pressed === true) {
				pressedKeys.push(entry);
			}
		}

		return pressedKeys;
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
		let info = Object.entries(this.keys);

		let render = [];
		let count  =  0;

		let i = 0;
		for(; i < info.length; i++) {
			let keyData = info[i];

			if(keyData[1].pressed === true) {
				render[count] = (
					<div className = "pressedKey" key = {keyData[0]}>
						{keyData[0]}
					</div>
				);

				count++;
			}
		}

		return (
			<div id = "PressedKeys">
				<b> Pressed </b>
				{render}
			</div>
		);
	}

	renderLogged() {
		var keyLogs = [];

		if(this.log_count > 0) {
			var i = 0;
			for(; i < Math.min(3, this.log_count); i++) {
				var l = this.log[this.log_count - (i + 1)];
				keyLogs.push(
					<KeyLog key = {"keylog_" + i} index = {l.index.toString()}
						pressedKey = {l.key} onTime = {l.onTime} offTime = {l.offTime}/>
				);
			}
		}

		return (
			<div id = "KeyLogs">
				{keyLogs}
			</div>
		);
	}
}

//
// - APP
//

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
						displayInfo   : false
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

	onButtonEvent(name) {
		var audio = new Audio("/click.mp3");
    audio.play();

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
					var pressedKeys = this.keyLogger.getPressed();

					for(let key in pressedKeys) {
						this.handleSwitchKeys(key, false);
					}

					this.keyLogger.clear();
				}
			break;

			case "info":
				let pressed = !this.state.displayInfo;
				this.setState({displayInfo: pressed});
			break;
		}

		this.setState(this.macroPlayer.getMacroState());
	}

	selectMacro(index) {
		if(this.macroPlayer.selectMacro(index)) {
			this.keyLogger.clear();
		}
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

	renderInfo() {
		let data = this.macroPlayer.getCurrentMacroData();
		let name = data.name;
		let info = data.info;

		return (
			<div id = "Info">
				<button className = "info-button" id = "InfoButton"
					onMouseDown  = {e => this.onButtonEvent("info", true)}
					onTouchStart = {e => this.onButtonEvent("info", true)}>
					Info
				</button>
				<InfoOverlay show = {this.state.displayInfo}
					title = {name} sections = {info}
					onMouseDown  = {e => this.onButtonEvent("info", false)}
					onTouchStart = {e => this.onButtonEvent("info", false)}/>
			</div>
		);
	}

	render() {
		const pressed = this.keyLogger.renderPressed();
		const logging = this.keyLogger.renderLogged();

		const macros = this.renderMacros();
		const parameters = this.renderParameters();
		const info = this.renderInfo();

		const current = this.macroPlayer.state.playState;

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
						{info}
					</div>
					<div id = "Tracker">
						<ProgressBar key = "progressbar" percentage = {this.state.macroProgress} />
						<div id = "KeyLogging">
							{pressed}
							{logging}
						</div>
					</div>
					<div id = "PlayerButtons">
						<PlayerButton id = "ResetButton" selected = {current === MacroStates.INACTIVE} name = "Reset"
							src = "./images/reset_icon.png" clickHandler = {e => this.onButtonEvent("reset")}/>
						<PlayerButton id = "PlayButton" selected = {current === MacroStates.PLAYING} name = "Play"
							src = "./images/play_icon.png" clickHandler = {e => this.onButtonEvent("play")}/>
						<PlayerButton id = "PauseButton" selected = {current === MacroStates.PAUSED} name = "Pause"
							src = "./images/pause_icon.png" clickHandler = {e => this.onButtonEvent("pause")}/>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
