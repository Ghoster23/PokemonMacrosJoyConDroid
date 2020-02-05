import React, { Component } from 'react';
import './App.css';

const MacroStates = {
	INACTIVE: 0,
	PLAYING:  1,
	PAUSED:   2,
	FINISHED: 3
}

function ConvertDate(date) {
	return date.toISOString().slice(0,10);
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
					<div className = "MacroParameters" id = "TimeSkipParams">
						<label className = "Parameter">
							Start Date
							<DateInput id = "startDate" name = "start-date"
								date = {this.props.startDate} onChange = {this.handleSDChange}
								readonly = {readonly}/>
						</label>
						<label className = "Parameter">
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
					<input type = "checkbox" checked = {this.props.checked} onChange = {this.handleChange} />
				);

			case 2:
				return (
					<input type = "checkbox" checked = {this.props.checked} onChange = {this.handleChange} />
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

function BuildTimeSkipMacro(startDate, days) {
	var paths = [];
	var reps  = [];


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

							// Wait
							while(this.onWait) {
								info = yield res;
								if(info.abort) return;
								this.state = info.state;
							}

							res.pressed = false; // Signal the the button is not pressed

							// Set timer for the wait before pressing the next button
							this.wait(Math.max(step.offTime, 20));

							// Wait for timer to elapse and to not be paused
							while(this.onWait || this.state === MacroStates.PAUSED) {
								info = yield res;
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
		this.macros[0] = new Macro("Skip First Day", ["./macros/SkipFirstDay.json"], [1]);
		this.macros[1] = new Macro("Skip First Day", ["./macros/SkipFirstDay.json"], [1]);

		this.selectedMacro = 0;

		var today = new Date();
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

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
			}

			if(res.done) currentMacro.state = MacroStates.FINISHED;
		}
	}

	setMacro(id) {
		this.selectedMacro = id;

		var currentMacro = this.macros[this.selectedMacro];

		if(currentMacro.state !== MacroStates.INACTIVE) {
			currentMacro.reset();
			console.log("reset");
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
					console.log("reset");
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
		var startDate = new Date(newDate);
		var endDate   = new Date(this.state.endDate);

		this.setState({startDate : newDate});

		if(startDate >= endDate) {
			endDate = new Date(startDate.getTime());
			endDate.setDate(endDate.getDate() + 1);

			this.setState({endDate : ConvertDate(endDate)});
		}
	}

	onEndDateChange(newDate) {
		var endDate   = new Date(newDate);
		var startDate = new Date(this.state.startDate);

		this.setState({endDate : newDate});

		if(startDate >= endDate) {
			startDate = new Date(endDate.getTime());
			startDate.setDate(startDate.getDate() - 1);

			this.setState({startDate : ConvertDate(startDate)});
		}
	}

	handleSwitchKeys(name, pressed) {
		console.log(name + " : " + pressed);

		if(window.joyconJS === undefined) return;

		this.handleArrowKeys(name, pressed);

		if(name === "home") {
			window.joyconJS.onHome(pressed);
			this.setState({homePressed: pressed});
		}

		if(name === "plus") {
			window.joyconJS.onPlus(pressed);
			this.setState({plusPressed: pressed});
		}

		if(name === "a") {
			window.joyconJS.onA(pressed);
			this.setState({aPressed: pressed});
		}

		if(name === "b") {
			window.joyconJS.onB(pressed);
			this.setState({bPressed: pressed});
		}

		if(name === "x") {
			window.joyconJS.onX(pressed);
			this.setState({xPressed: pressed});
		}

		if(name === "y") {
			window.joyconJS.onY(pressed);
			this.setState({yPressed: pressed});
		}

		if(name === "sl") {
			window.joyconJS.onRightSL(pressed);
			this.setState({slPressed: pressed});
		}

		if(name === "sr") {
			window.joyconJS.onRightSR(pressed);
			this.setState({srPressed: pressed});
		}

		if(name === "stick") {
			window.joyconJS.onRightJoystickPressed(pressed);
			this.setState({stickPressed: pressed});
		}
	}

	handleArrowKeys(name, pressed) {
		var x = 0;
		var y = 0;

		if (name === "down"  ||  name === "up"   ||
			name === "right" ||  name === "left") {

			if(name === "down") {
				y += pressed? 1 : 0;
				this.setState({downPressed: pressed});

			} else {
				y += this.state.downPressed? 1 : 0;
			}

			if(name === "up") {
				y += pressed? -1 : 0;
				this.setState({upPressed: pressed});

			} else {
				y += this.state.upPressed? -1 : 0;
			}

			if(name === "left") {
				x += pressed? -1 : 0;
				this.setState({leftPressed: pressed});

			} else {
				x += this.state.leftPressed? -1 : 0;
			}

			if(name === "right") {
				x += pressed? 1 : 0;
				this.setState({rightPressed: pressed});

			} else {
				x += this.state.rightPressed? 1 : 0;
			}

			//if (x === 0 && y === 0) {
			//    window.joyconJS.onRightJoystick(0,0);
			//
			//} else {
			//    window.joyconJS.onRightJoystick(100, Math.atan2(x, y));
			//}
		}
	}

	render() {
		const macros = this.macros.map((macro, index) => {
			var selected = this.selectedMacro === index;
			var style = (selected ? {background : "black", color : "white"} : {background : "white", color : "black"});

			return (
				<div className = "Macro">
					<button key = {index} className = "MacroButton" id = {macro.name} style = {style} onClick = {e => this.setMacro(index)}>
						{macro.name}
					</button>
					<ParameterInput key = "paramInput"
						active = {selected} locked = {this.state.locked}
						macro = {index}
						startDate = {this.state.startDate} onStartDateChange = {this.onStartDateChange}
						endDate   = {this.state.endDate}   onEndDateChange   = {this.onEndDateChange} />
				</div>
			)
		});

		return (
			<div className = "App">
				<div className = "App-header">
					{this.state.selectedMacro + " " + this.state.macroState}
				</div>
				<div id = "body">
					<div id = "Macros">
						{macros}
					</div>
					<div id = "MacroParameters">
						<label id = "ParamCheckBox">
							Use Parameters:
							<CheckBox key = "useParams" checked = {this.state.useParams} onChange = {this.onUseParams}/>
						</label>
					</div>
					<div>
						<ProgressBar key = "progress" percentage = {this.state.macroProgress} />
					</div>
					<div id = "PlayerButtons" className = "Buttons">
						<button key = "reset" className = "MacroButton" id = "Reset"
							onMouseDown  = {e => this.onButtonEvent("reset", true)}
							onMouseUp    = {e => this.onButtonEvent("reset", false)}
							onTouchStart = {e => this.onButtonEvent("reset", true)}
							onTouchEnd   = {e => this.onButtonEvent("reset", false)}>
							Reset
						</button>
						<button key = "play" className = "MacroButton" id = "Play"
							onMouseDown  = {e => this.onButtonEvent("play", true)}
							onMouseUp    = {e => this.onButtonEvent("play", false)}
							onTouchStart = {e => this.onButtonEvent("play", true)}
							onTouchEnd   = {e => this.onButtonEvent("play", false)}>
							Play
						</button>
						<button key = "pause" className = "MacroButton" id = "Pause"
							onMouseDown  = {e => this.onButtonEvent("pause", true)}
							onMouseUp    = {e => this.onButtonEvent("pause", false)}
							onTouchStart = {e => this.onButtonEvent("pause", true)}
							onTouchEnd   = {e => this.onButtonEvent("pause", false)}>
							Pause
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
