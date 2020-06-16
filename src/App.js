import React, { Component } from 'react';
import './App.css';

//
// - Constants and Globals
//

const MacroStates = {
	INACTIVE: 0,
	PLAYING:  1,
	PAUSED:   2,
	FINISHED: 3
}

//
// - AUX Functions
//

function degToRad(angle) {
	return angle * (Math.PI / 180);
}

async function LoadJson(path) {
	var res = null;

	res = await fetch(path).then(response => { return response.json(); } );

	return res;
}

function generateButtonPress(button, onTime, offTime, count) {
	return [
		{
			name: "Press " + button,
			macro: [
				{
					button  : button,
					onTime  : onTime,
					offTime : offTime,
					count   : 1
				}
			],
			count: count
		}
	];
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
			<b className = "key-log-cell"> {props.start} </b>
			<b className = "key-log-cell"> {props.duration} </b>
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

		let value = Math.min(event.currentTarget.value, this.props.max);

		this.props.onChange(parseInt(value));
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
									value    = {params.dateFormat}
									options  = {["World", "US", "Chinese"]}
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
									options = {["World", "US", "Chinese"]}
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

			case "Egg Hatcher":
				return (
					<div className = "macro-parameters" id = "EggHatcherParams">
						<div className = "parameters-entry">
							<label className = "parameter-label">
								Egg Cycles
							</label>
							<div className = "parameter">
								<DropDownList id = "eggCycles" name = "egg-cycles"
									value    = {params.eggCycles.toString()}
									options  = {["5", "10", "15", "20", "25", "30", "35", "40"]}
									onChange = {value => this.props.eventHandler("eggCycles", value)}
								/>
							</div>
						</div>
						<div className = "parameters-entry">
							<label className = "parameter-label">
								Hatching Ability
							</label>
							<div className = "parameter">
								<CheckBox id = "hasHatchAbility" name = "hatch-ability"
									checked  = {params.ability}
									paramKey = "ability"
									onChange = {this.props.eventHandler}
								/>
							</div>
						</div>
						<div className = "parameters-entry">
							<label className = "parameter-label">
								Eggs in Box
							</label>
							<div className = "parameter">
								<IntegerInput id = "eggsInBox" name = "eggs-in-box"
									value = {params.eggsInBox}
									onChange = {value => this.props.eventHandler("eggsInBox", value)}
									min = "1" max = "30"
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

class JSONManeger {
	constructor() {
		this.segments = {
			FstSkip      : {filename: "FirstSkip.json",           object: ""},
			FstSkipUS    : {filename: "FirstSkipUS.json",         object: ""},
			FstSkipCHN   : {filename: "FirstSkipCHN.json",        object: ""},
			AdvDay       : {filename: "AdvanceDay.json",          object: ""},
			AdvDayUS     : {filename: "AdvanceDayUS.json",        object: ""},
			AdvDayCHN    : {filename: "AdvanceDayCHN.json",       object: ""},
			LotoID       : {filename: "LotoID.json",              object: ""},
			Universal    : {filename: "UniversalSkip.json",       object: ""},
			UniversalUS  : {filename: "UniversalSkipUS.json",     object: ""},
			UniversalCHN : {filename: "UniversalSkipCHN.json",    object: ""},
			OpenBox      : {filename: "OpenBox.json",             object: ""},
			SelectInBox  : {filename: "SelectInBox.json",         object: ""},
			PlaceInBox   : {filename: "PlaceInBox.json",          object: ""},
			StartWonder  : {filename: "StartWonderTrade.json",    object: ""},
			EndWonder    : {filename: "ConcludeWonderTrade.json", object: ""},
			Hatching     : {filename: "Hatching.json",            object: ""}
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

		segment.object = await LoadJson("./macros/" + segment.filename);

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

				case 2: // Chinese
					this.currentFormat = "CHN";
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

		var count = this.parameters.daysToAdvance - 1;

		// If more than 1 skip
		if(count > 0) {
			// Calculate the number of macro repetitions
			let months = Math.floor(count / 31);
			let total  = count + months + Math.floor(months / 31);

			// Advance the adjustment
			while(total > 0) {
				this.AdvanceDay(Math.min(31, total));

				total -= 31;

				if(total > 0) {
					this.concatToMacro(generateButtonPress("down", 120, 240, 2));
				}
			}
		}

		this.concatToMacro(generateButtonPress("home", 100, 1000, 2));

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
			attempts   : this.onAttemptsChange,
			getFirst   : this.onGetFirstChange,
			dateFormat : this.onDateFormatChange
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

				case 2: // Chinese
					this.currentFormat = "CHN";
				break;
			}

			return true;
		}

		return false;
	}

	// Build Macro
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

			this.concatToMacro(generateButtonPress("home", 100, 1000, 2));

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
	SelectInBox(column, row) {
		var segments = this.getMacro("SelectInBox");

		let dx = column;
		let dy = row;

		if(dx > 0) {
			segments[0].macro[0].count = dx;
		}
		else {
			segments[0].macro[1].count = -1 * dx;
		}

		if(dy > 0) {
			segments[0].macro[2].count = dy;
		}
		else {
			segments[0].macro[3].count = -1 * dy;
		}

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

				this.SelectInBox(column, row);

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

class EggHatcherMacroBuilder extends MacroBuilder {
	constructor(jsonM) {
		super(jsonM, "Egg Hatcher", "./images/egghatcher_icon.png");

		this.parameters.eggCycles = 5;
		this.parameters.ability   = false;
		this.parameters.eggCharm  = false;
		this.parameters.eggsInBox = 1;

		this.onEggCyclesChange   = this.onEggCyclesChange.bind(this);
		this.onHasAbilityChange  = this.onHasAbilityChange.bind(this);
		this.onEggsInBoxChange   = this.onEggsInBoxChange.bind(this);

		this.paramHandlers = {
			eggCycles : this.onEggCyclesChange,
			ability   : this.onHasAbilityChange,
			eggsInBox : this.onEggsInBoxChange
		};

		var text1 = (
			<p>
				<b>1-</b> Open your PC and navigate to the Box with the eggs. Make sure that the box was filled from up to down, left to right.
				This means the eggs should be placed column per column not row per row as is normal, if the box is full this doesn't matter.
				<br/>
				<br/>
				<b>2-</b> You must leave the <b>Pokémon</b> option selected when exiting the game's menu.
				<br/>
				<br/>
				<b>3-</b> When starting the macro, the <b>Player Character</b> must be near the <b>Nursery</b> at the Wild Area and not on the bike.
				<br/>
				<br/>
				<b>4-</b> Set the <b>Egg Cycles</b> parameter to how many cycles the egg takes to hatch, this can be checked on sites like Bulbapedia.
				<br/>
				<br/>
				<b>5-</b> Check the <b>Hatch Ability</b> box if the first pokemon in the party has one of the following abilities: Flame Body, Magma Armor or Steam Engine.
				<br/>
				<br/>
				<b>6-</b> Set the <b>Eggs in Box</b> parameter to how many eggs you have in the box to be hatched.
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
	onEggCyclesChange(cycles) {
		cycles = 5 * (parseInt(cycles) + 1);

		if(this.parameters.eggCycles !== cycles) {
			this.parameters.eggCycles = cycles;

			return true;
		}

		return false;
	}

	onHasAbilityChange(bool) {
		if(this.parameters.ability !== bool) {
			this.parameters.ability = bool;

			return true;
		}

		return false;
	}

	onEggsInBoxChange(count) {
		if(this.parameters.eggsInBox !== count) {
			this.parameters.eggsInBox = count;

			return true;
		}

		return false;
	}

	// Build Macro
	InBoxSegment(type, cColumn, cRow, tColumn, tRow) {
		var segments = this.getMacro(type + "InBox");

		let dx = tColumn - cColumn;
		let dy = tRow - cRow;

		if(dx > 0) {
			segments[0].macro[0].count = dx;
		}
		else {
			segments[0].macro[1].count = -1 * dx;
		}

		if(dy > 0) {
			segments[0].macro[2].count = dy;
		}
		else {
			segments[0].macro[3].count = -1 * dy;
		}

		if(type === "Select") {
			segments[0].macro[6].offTime = 600;
		}

		this.concatToMacro(segments);
	}

	HatchSegment(eggsInParty) {
		let segments = this.getMacro("Hatching");

		// Calculate steps to hatch egg
		let cycles = this.parameters.eggCycles;
		if(this.parameters.ability) cycles = cycles / 2;

		// Calculate time to hatch
		let time = cycles * 6400;

		segments[0].macro[2].onTime = time;
		segments[0].macro[3].onTime = time;

		segments[1].count = eggsInParty;

		this.concatToMacro(segments);
	}

	build() {
		if(!this.jsonManager.loadConcluded) return null;

		this.macroJSON = []; // Clear Macro JSON

		let count  = 0;

		let sX = 0;

		while(count < this.parameters.eggsInBox) {
			this.concatToMacro(this.getMacro("OpenBox"));

			// Get Eggs into the Party
			let sY = 0;

			let cX = 0;
			let cY = 0;

			while(sY < 5 && count < this.parameters.eggsInBox) {
				this.InBoxSegment("Select", cX, cY, sX, sY);

				cX = sX;
				cY = sY;

				this.InBoxSegment("Place", cX, cY, -1, 1 + sY);

				cX = -1;
				cY = 1 + sY;

				sY++;

				count++;
			}

			sX++;

			// Exit PC to Menu
			this.concatToMacro(generateButtonPress(   "b", 180, 1480, 1));
			this.concatToMacro(generateButtonPress(   "b", 180, 1720, 1));

			// Select Map
			this.concatToMacro(generateButtonPress("left", 180,  240, 1));
			this.concatToMacro(generateButtonPress("down", 180,  240, 1));

			// Recenter at Nursery
			this.concatToMacro(generateButtonPress(   "a", 180, 2400, 3));

			// Hatch Eggs
			this.HatchSegment(sY);

			// Select the PC
			this.concatToMacro(generateButtonPress(    "x", 180,  840, 1));
			this.concatToMacro(generateButtonPress("right", 180,  240, 1));
			this.concatToMacro(generateButtonPress(   "up", 180,  240, 1));
			this.concatToMacro(generateButtonPress(    "b", 180, 1720, 1));
			this.concatToMacro(generateButtonPress( "plus", 180, 1200, 1));
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

		this.commands = [];

		this.onWait = false;

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
		if(this.totalSteps === 0) return 1;

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

						// Make commands
						let command = this.makeCommand(step.button,  true, step.strength, step.angle);
						let reset   = this.makeCommand(step.button, false,             0,          0);

						// Check if input blocks progress
						let block = step.block === undefined || step.block === true;

						// For each repetition of the Step
						var l = 0;
						for(l = 0; l < step.count; l++) {
							this.commands.push(command);

							// Set timed command
							this.timedCommand(reset, block, Math.max(step.onTime, 20));

							yield this.commands;
							this.commands = [];

							// Wait
							while(this.onWait) {
								info = yield undefined;
								if(info.abort) return;
								this.state = info.state;
							}

							// If there is a buffer before the next button press
							if(block === true && step.offTime > 0) {
								this.onWait = true;

								// Set timer for the wait before pressing the next button
								this.timedCommand(null, block, Math.max(step.offTime, 20));
							}

							yield this.commands;
							this.commands = [];

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

	makeCommand(button, pressed, strength, angle) {
		return {
			button   : button,
			pressed  : pressed,
			strength : strength,
			angle    : angle
		};
	}

	timedCommand(command, blocking, duration) {
		setTimeout(this.issueCommand, duration, this, command, blocking); // New Timer

		// Block Macro progress
		this.onWait = blocking;
	}

	issueCommand(obj, command, blocking) {
		if(command !== null) {
			obj.commands.push(command);
		}

		// If step was blocking, unblock
		if(blocking) obj.onWait = false;
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
		this.builders[3] = new EggHatcherMacroBuilder(this.jsonManager);

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
			l               : {pressed : false, pendingLog: null},
			lsl             : {pressed : false, pendingLog: null},
			lsr             : {pressed : false, pendingLog: null},
			r               : {pressed : false, pendingLog: null},
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

		this.startTime = 0;

		this.log = [];
		this.log_count = 0;
	}

	clear() {
		this.keys = {
			a               : {pressed : false, pendingLog: null},
			b               : {pressed : false, pendingLog: null},
			x               : {pressed : false, pendingLog: null},
			y               : {pressed : false, pendingLog: null},
			l               : {pressed : false, pendingLog: null},
			lsl             : {pressed : false, pendingLog: null},
			lsr             : {pressed : false, pendingLog: null},
			r               : {pressed : false, pendingLog: null},
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

		this.startTime = 0;

		this.log = [];
		this.log_count = 0;
	}

	pressKey(key, time) {
		if(key !== "buffer") {
			let info = this.keys[key];

			// If key is not pressed
			if(info.pressed === false) {
				info.pressed = true;

				if(this.startTime === 0) {
					this.startTime = time;
				}

				info.pendingLog = this.addLogEntry(key, time - this.startTime);
			}

			this.keys[key] = info;
		}
	}

	addLogEntry(key, time) {
		let entry = {index: this.log_count, key: key, start: time, duration: 0}

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

				entry.duration = time - entry.start - this.startTime;

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

	update(key, pressed) {
		let time = (new Date()).getTime();

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
						pressedKey = {l.key} start = {l.start} duration = {l.duration}/>
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

		// If there was an Update
		if(res !== undefined) {
			// Iterate the Log
			let i;
			for(i = 0; i < res.length; i++) {
				let command = res[i];

				// If it was a JoyStick Update
				if(command.button === "right_stick_dir" ||
					 command.button === "left_stick_dir") {
					this.handleSwitchJoySticks(command.button, command.strength, command.angle);
				}

				// If it was a Key Update
				else {
					this.handleSwitchKeys(command.button, command.pressed);
				}

				this.keyLogger.update(command.button, command.pressed);
			}
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

					let i;
					for(i = 0; i < pressedKeys.length; i++) {
						let key = pressedKeys[i];

						if(key === "left_stick_dir" ||
							 key === "right_stick_dir") {
							this.handleSwitchJoySticks(key, 0, 0);
						}
						else {
							this.handleSwitchKeys(key, false);
						}
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

	handleSwitchJoySticks(joystick, strength, angle) {
		let rads = degToRad(angle);

		if(window.joyconJS === undefined) return;

		if(joystick === "right_stick_dir") {
			window.joyconJS.onRightJoystick(strength, rads);
		}

		if(joystick === "left_stick_dir") {
			window.joyconJS.onLeftJoystick(strength, rads);
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

		if(name === "l") {
			window.joyconJS.onL(pressed);
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

		if(name === "r") {
			window.joyconJS.onR(pressed);
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
