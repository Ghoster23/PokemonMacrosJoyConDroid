(this["webpackJsonppoke-macros-joycondroid"]=this["webpackJsonppoke-macros-joycondroid"]||[]).push([[0],{10:function(e,t,a){e.exports=a.p+"static/media/click.a99ad0ce.mp3"},11:function(e,t,a){e.exports=a(19)},17:function(e,t,a){},18:function(e,t,a){},19:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(9),o=a.n(s),i=a(6),c=a.n(i),l=a(3),u=a(5),h=a(4),m=a(7),d=a(1),p=a(2),g=(a(17),a(10)),v=a.n(g),y=0,f=1,b=2,k=3,E=4,S=0,C=1,w=2,j=3,x=4,M=[31,28,31,30,31,30,31,31,30,31,30,31],O="/PokemonMacrosJoyConDroid/assets/images/";function D(e){var t=parseInt(e.substr(0,4)),a=parseInt(e.substr(5,6));return[parseInt(e.substr(8,9)),a,t]}var T=function(){function e(t,a,n){Object(d.a)(this,e),this.Day=t,this.Month=a,this.Year=n}return Object(p.a)(e,[{key:"isLeapYear",value:function(e){return e%4!==0&&(e%100!==0||e%400===0)}},{key:"isLastDayOfMonth",value:function(){return this.Day===M[this.Month-1]}},{key:"increment",value:function(){this.Day+=1;var e=M[this.Month-1];2===this.Month&&this.isLeapYear(this.Year)&&(e+=1),this.Day>e&&(this.Month+=1,this.Day=1,this.Month>12&&(this.Year+=1,this.Month=1))}},{key:"toString",value:function(){var e=""+this.Month;this.Month<10&&(e="0"+e);var t=""+this.Day;return this.Day<10&&(t="0"+t),this.Year+"-"+e+"-"+t}},{key:"displayText",value:function(){var e=""+this.Month;this.Month<10&&(e="0"+e);var t=""+this.Day;return this.Day<10&&(t="0"+t),t+" / "+e+" / "+this.Year}}]),e}();function N(e){return L.apply(this,arguments)}function L(){return(L=Object(m.a)(c.a.mark((function e(t){var a;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=null,e.next=3,fetch(t).then((function(e){return e.json()}));case 3:return a=e.sent,e.abrupt("return",a);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function P(e,t,a,n){return[{name:"Press "+e,macro:[{button:e,onTime:t,offTime:a,count:1}],count:n}]}function B(e){var t={background:"#FFF"},a={};return e.selected&&(t={background:"#000"},a={filter:"invert(1)"}),r.a.createElement("div",{className:"player-button",id:e.name,style:t,onClick:function(t){return e.clickHandler()}},r.a.createElement("img",{className:"icon",src:e.src,alt:e.name+" Button Icon",style:a}))}function A(e){var t={background:"white"};return e.selected&&(t={background:"black"}),r.a.createElement("div",{className:"macro"},r.a.createElement("div",{className:"macro-button",id:e.name,style:t,onClick:function(t){return e.clickHandler(e.index)}},r.a.createElement("img",{className:"icon",src:e.src,alt:"Icon "+e.name})),r.a.createElement("label",{className:"macro-button-label"},e.name))}function I(e){var t={width:"".concat(e.percentage,"%")};return r.a.createElement("div",{className:"progress-bar"},r.a.createElement("div",{className:"filler",style:t}))}function H(e){return r.a.createElement("div",{key:e.ind,className:"key-log"},r.a.createElement("b",{className:"key-log-cell"}," ",e.index," "),r.a.createElement("b",{className:"key-log-cell"}," ",e.pressedKey," "),r.a.createElement("b",{className:"key-log-cell"}," ",e.start," "),r.a.createElement("b",{className:"key-log-cell"}," ",e.duration," "))}var _=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).state={},n.handleChange=n.handleChange.bind(Object(l.a)(n)),n}return Object(p.a)(a,[{key:"handleChange",value:function(e){return this.props.onChange(this.props.paramKey,e.target.checked)}},{key:"render",value:function(){return r.a.createElement("input",{type:"checkbox",checked:this.props.checked,onChange:this.handleChange})}}]),a}(r.a.Component),J=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).state={},n.handleChange=n.handleChange.bind(Object(l.a)(n)),n}return Object(p.a)(a,[{key:"handleChange",value:function(e){if(""!==e.target.value){var t=Math.min(e.currentTarget.value,this.props.max);this.props.onChange(parseInt(t))}else this.props.onChange(1)}},{key:"render",value:function(){return r.a.createElement("input",{type:"number",className:"integer-input",readOnly:this.props.readonly,value:this.props.value,onChange:this.handleChange,max:this.props.max,min:this.props.min})}}]),a}(r.a.Component),R=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).state={},n.handleChange=n.handleChange.bind(Object(l.a)(n)),n}return Object(p.a)(a,[{key:"handleChange",value:function(e){if(""!==e.target.value){var t=e.currentTarget.value;this.props.onChange(t)}else this.props.onChange("2020-01-01")}},{key:"render",value:function(){return r.a.createElement("input",{type:"date",className:"date-input",readOnly:this.props.readonly,value:this.props.value,onChange:this.handleChange,max:this.props.max,min:this.props.min})}}]),a}(r.a.Component),F=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).state={},n.handleChange=n.handleChange.bind(Object(l.a)(n)),n}return Object(p.a)(a,[{key:"handleChange",value:function(e){""!==e.target.value?this.props.onChange(parseInt(e.currentTarget.value)):this.props.onChange(0)}},{key:"renderOptions",value:function(){return this.props.options.map((function(e,t){return r.a.createElement("option",{key:"option"+t.toString(),value:t},e)}))}},{key:"render",value:function(){var e=this.renderOptions();return r.a.createElement("select",{className:"drop-down-list",onChange:this.handleChange},e)}}]),a}(r.a.Component),W=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).state={active:!1},n}return Object(p.a)(a,[{key:"render",value:function(){var e=this,t=this.props.parameters;switch(this.props.macro){default:return r.a.createElement("div",{className:"macro-parameters",id:"DefaultParams"});case"Time Skip":return r.a.createElement("div",{className:"macro-parameters",id:"TimeSkipParams"},r.a.createElement("div",{className:"parameters-entry"},r.a.createElement("label",{className:"parameter-label"},"Start Date"),r.a.createElement("div",{className:"parameter"},r.a.createElement(R,{id:"startDate",name:"start-date",value:t.startDate,onChange:function(t){return e.props.eventHandler("startDate",t)},min:"2000-01-01",max:"2059-12-31"}))),r.a.createElement("div",{className:"parameters-entry"},r.a.createElement("label",{className:"parameter-label"},"Skip Count"),r.a.createElement("div",{className:"parameter"},r.a.createElement(J,{id:"daysToAdvance",name:"days-to-advance",value:t.daysToAdvance,onChange:function(t){return e.props.eventHandler("daysToAdvance",t)},min:"1",max:"1000"}))),r.a.createElement("div",{className:"parameters-entry"},r.a.createElement("label",{className:"parameter-label"},"Date Format"),r.a.createElement("div",{className:"parameter"},r.a.createElement(F,{id:"dateFormat",name:"date-format",value:t.dateFormat,options:["World","US","Chinese"],onChange:function(t){return e.props.eventHandler("dateFormat",t)}}))));case"Wonder Box":return r.a.createElement("div",{className:"macro-parameters",id:"WonderBoxParams"},r.a.createElement("div",{className:"parameters-entry"},r.a.createElement("label",{className:"parameter-label"},"Count"),r.a.createElement("div",{className:"parameter"},r.a.createElement(J,{id:"WTradeCount",name:"wonder-trade-count",value:t.count,onChange:function(t){return e.props.eventHandler("count",t)},min:"1",max:"30"}))));case"Egg Hatcher":return r.a.createElement("div",{className:"macro-parameters",id:"EggHatcherParams"},r.a.createElement("div",{className:"parameters-entry"},r.a.createElement("label",{className:"parameter-label"},"Egg Cycles"),r.a.createElement("div",{className:"parameter"},r.a.createElement(F,{id:"eggCycles",name:"egg-cycles",value:t.eggCycles.toString(),options:["5","10","15","20","25","30","35","40"],onChange:function(t){return e.props.eventHandler("eggCycles",t)}}))),r.a.createElement("div",{className:"parameters-entry"},r.a.createElement("label",{className:"parameter-label"},"Hatching Ability"),r.a.createElement("div",{className:"parameter"},r.a.createElement(_,{id:"hasHatchAbility",name:"hatch-ability",checked:t.ability,paramKey:"ability",onChange:this.props.eventHandler}))),r.a.createElement("div",{className:"parameters-entry"},r.a.createElement("label",{className:"parameter-label"},"Eggs in Box"),r.a.createElement("div",{className:"parameter"},r.a.createElement(J,{id:"eggsInBox",name:"eggs-in-box",value:t.eggsInBox,onChange:function(t){return e.props.eventHandler("eggsInBox",t)},min:"1",max:"30"}))))}}}]),a}(r.a.Component),K=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).state={active:!1},n}return Object(p.a)(a,[{key:"render",value:function(){var e=this.props.status;switch(this.props.macro){default:return r.a.createElement("div",{className:"macro-status",id:"DefaultStatus"});case"Time Skip":var t=0;void 0!==e.daysAdvanced&&(t=e.daysAdvanced);var a="01 / 01 / 2020";return void 0!==e.currentDate&&(a=e.currentDate.displayText()),r.a.createElement("div",{className:"macro-status",id:"TimeSkipStatus"},r.a.createElement("div",{className:"status-entry"},r.a.createElement("label",{className:"status-label"},"Skips Done"),r.a.createElement("div",{className:"status"},t)),r.a.createElement("div",{className:"status-entry"},r.a.createElement("label",{className:"status-label"},"Current Date"),r.a.createElement("div",{className:"status"},a)));case"Wonder Box":var n=0;void 0!==e.traded&&(n=e.traded);var s=0;void 0!==e.currentRow&&(s=e.currentRow);var o=0;void 0!==e.currentColumn&&(o=e.currentColumn);var i="Row: "+s.toString()+" | Col: "+o.toString();return r.a.createElement("div",{className:"macro-status",id:"WonderBoxStatus"},r.a.createElement("div",{className:"status-entry"},r.a.createElement("label",{className:"status-label"},"Traded"),r.a.createElement("div",{className:"status"},n)),r.a.createElement("div",{className:"status-entry"},r.a.createElement("label",{className:"status-label"},"Box Slot"),r.a.createElement("div",{className:"status"},i)));case"Egg Hatcher":var c=0;return void 0!==e.hatched&&(c=e.hatched),r.a.createElement("div",{className:"macro-status",id:"EggHatcherStatus"},r.a.createElement("div",{className:"status-entry"},r.a.createElement("label",{className:"status-label"},"Hatched"),r.a.createElement("div",{className:"status"},c)))}}}]),a}(r.a.Component),U=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).state={},n}return Object(p.a)(a,[{key:"render",value:function(){var e={display:"none"};this.props.show&&(e.display="flex");for(var t=[],a=0;a<this.props.sections.length;a++){var n=this.props.sections[a];t[a]=r.a.createElement("div",{className:"infoSection",key:"infoSect_"+a.toString()},r.a.createElement("h2",{className:"infoSectionTitle"}," ",n.title," "),n.text)}return r.a.createElement("div",{id:"infoOverlay",className:"info-overlay",style:e},r.a.createElement("div",{id:"infoOverlayOut",onMouseDown:this.props.onMouseDown,onTouchStart:this.props.onTouchStart}),r.a.createElement("div",{id:"infoTextBox",className:"text-box"},r.a.createElement("h1",{className:"infoTextTitle"}," ",this.props.title," "),t))}}]),a}(r.a.Component);var Y=function(){function e(){Object(d.a)(this,e),this.segments={FstSkip:{filename:"FirstSkip.json",object:""},FstSkipUS:{filename:"FirstSkipUS.json",object:""},FstSkipCHN:{filename:"FirstSkipCHN.json",object:""},AdvDay:{filename:"AdvanceDay.json",object:""},AdvDayUS:{filename:"AdvanceDayUS.json",object:""},AdvDayCHN:{filename:"AdvanceDayCHN.json",object:""},GetEggs:{filename:"GetEggs.json",object:""},Recenter:{filename:"Recenter.json",object:""},OpenBox:{filename:"OpenBox.json",object:""},SelectInBox:{filename:"SelectInBox.json",object:""},StartWonder:{filename:"StartWonderTrade.json",object:""},EndWonder:{filename:"ConcludeWonderTrade.json",object:""},Hatching:{filename:"Hatching.json",object:""}};var t=Object.entries(this.segments);this.loadedCount=0,this.segmentCount=t.length,this.loadConcluded=!1;for(var a=0;a<this.segmentCount;a++)this.loadMacro(t[a][0])}return Object(p.a)(e,[{key:"loadMacro",value:function(){var e=Object(m.a)(c.a.mark((function e(t){var a;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=this.segments[t],e.next=3,N("/PokemonMacrosJoyConDroid/assets/macros/"+a.filename);case 3:a.object=e.sent,this.loadedCount+=1,this.loadedCount===this.segmentCount&&(this.loadConcluded=!0,console.log("JSON Load Concluded"));case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getMacro",value:function(e){var t=this.segments[e];if(void 0!==t)return JSON.parse(JSON.stringify(t.object));console.log("No macro associated with key: "+e)}}]),e}(),G=function(){function e(t,a,n){Object(d.a)(this,e),this.jsonManager=t,this.name=a,this.icon=n,this.parameters={},this.paramHandlers={},this.info=[],this.state={state:y,progress:0}}return Object(p.a)(e,[{key:"changeParameter",value:function(e,t){return(0,this.paramHandlers[e])(t)}},{key:"getMacro",value:function(e){return this.jsonManager.loadConcluded?this.jsonManager.getMacro(e):null}},{key:"getMacroState",value:function(){return this.state.state}},{key:"getMacroProgress",value:function(){return this.state.progress}},{key:"getDuration",value:function(){return 0}},{key:"start",value:function(){this.state.state=f}},{key:"reset",value:function(){this.state.state=y}},{key:"update",value:function(){console.log("This should have been overriden.")}},{key:"getRenderData",value:function(){return{name:this.name,icon:O+this.icon,state:this.state,parameters:this.parameters,info:this.info}}}]),e}(),z=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;Object(d.a)(this,a),(n=t.call(this,e,"Time Skip","timeskip_icon.png")).parameters.startDate="2020-01-01",n.parameters.daysToAdvance=1,n.parameters.dateFormat=0,n.currentFormat="",n.onStartDateChange=n.onStartDateChange.bind(Object(l.a)(n)),n.onDaysToAdvanceChange=n.onDaysToAdvanceChange.bind(Object(l.a)(n)),n.onDateFormatChange=n.onDateFormatChange.bind(Object(l.a)(n)),n.paramHandlers={startDate:n.onStartDateChange,daysToAdvance:n.onDaysToAdvanceChange,dateFormat:n.onDateFormatChange};var s=r.a.createElement("p",null,r.a.createElement("b",null,"1-")," In the ",r.a.createElement("b",null,"Console Settings"),", turn ",r.a.createElement("b",null,"Synchronize Time")," off.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"2-")," The ",r.a.createElement("b",null,"Date")," in ",r.a.createElement("b",null,"Console Settings")," must be the first of any 31 day month.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"3-")," Set ",r.a.createElement("b",null,"Skip Count")," to the number of days to advance.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"4-")," Set ",r.a.createElement("b",null,"Date Format")," to match your console's format.");return n.info=[{title:"SetUp",text:s},{title:"How it works",text:"The frame of the seed will advance with each time the date is advanced. This means that we can just change the day, with the only downside being that when returning to the first of the month no advancement will happen. The macro takes this into account and adds repetitions so that in the end the correct number of skips is achieved."},{title:"Recommendations",text:"Avoid doing many skips in the Wild Area as this is known to sometimes result in game crashes. Use this macro indoors."}],n.state.currentDate=new T(1,1,2020),n.state.daysAdvanced=0,n}return Object(p.a)(a,[{key:"getDuration",value:function(){return 10160+3440*this.parameters.daysToAdvance}},{key:"reset",value:function(){var e=D(this.parameters.startDate);this.state.state=y,this.state.currentDate=new T(e[0],e[1],e[2]),this.state.daysAdvanced=0}},{key:"onStartDateChange",value:function(e){if(this.parameters.startDate!==e){this.parameters.startDate=e;var t=D(e);return this.state.currentDate=new T(t[0],t[1],t[2]),!0}return!1}},{key:"onDaysToAdvanceChange",value:function(e){return this.parameters.daysToAdvance!==e&&(this.parameters.daysToAdvance=e,!0)}},{key:"onDateFormatChange",value:function(e){if(this.parameters.dateFormat!==e){switch(this.parameters.dateFormat=e,e){default:case 0:this.currentFormat="";break;case 1:this.currentFormat="US";break;case 2:this.currentFormat="CHN"}return!0}return!1}},{key:"AdvanceDay",value:function(e){var t=this.getMacro("AdvDay"+this.currentFormat);return t[0].count=e,t}},{key:"InitMacro",value:function(){return this.getMacro("FstSkip"+this.currentFormat)}},{key:"update",value:function(){var e={state:0,macroStep:void 0};switch(this.state.state){default:break;case f:e.macroStep=this.InitMacro(),this.state.state=b;break;case b:this.state.currentDate.isLastDayOfMonth()?this.state.currentDate.Day=0:this.state.daysAdvanced+=1,this.state.currentDate.increment(),this.parameters.daysToAdvance>this.state.daysAdvanced?e.macroStep=this.AdvanceDay(1):(e.macroStep=P("home",100,1e3,2),this.state.state=E)}return this.state.progress=this.state.daysAdvanced/this.parameters.daysToAdvance,e.state=this.state.state,e}}]),a}(G),X=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;Object(d.a)(this,a),(n=t.call(this,e,"Wonder Box","wonderbox_icon.png")).parameters.count=1,n.onCountChange=n.onCountChange.bind(Object(l.a)(n)),n.paramHandlers={count:n.onCountChange};var s=r.a.createElement("p",null,r.a.createElement("b",null,"1-")," In-Game, open your PC and go to the box with the pokemon to be wonder traded.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"2-")," Make sure there are no empty spots between pokemon. The macro will start trading from the top left corner and go left to right, top to bottom.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"3-")," Exit all menus.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"4-")," Set the ",r.a.createElement("b",null,"Count")," parameter to how many pokemon you want to trade away from that box.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"5-")," The macro will pause after starting the trade. Press play after you see the trade has completed.");return n.info=[{title:"How to",text:s}],n.state.phase=0,n.state.traded=0,n.state.currentRow=0,n.state.currentColumn=0,n}return Object(p.a)(a,[{key:"reset",value:function(){this.state.state=y,this.state.traded=0,this.state.currentRow=0,this.state.currentColumn=0}},{key:"onCountChange",value:function(e){return this.parameters.count!==e&&(this.parameters.count=e,!0)}},{key:"SelectInBox",value:function(e,t){var a=this.getMacro("SelectInBox"),n=e,r=t;return n>0?a[0].macro[0].count=n:a[0].macro[1].count=-1*n,r>0?a[0].macro[2].count=r:a[0].macro[3].count=-1*r,a}},{key:"ConcludeTrade",value:function(){var e=this.getMacro("EndWonder");return e[0].macro[2].offTime=1e3*this.parameters.waitTime,e}},{key:"update",value:function(){var e={state:0,macroStep:void 0};switch(this.state.state===k&&(this.state.state=b),this.state.state){default:break;case f:e.macroStep=[],e.macroStep=e.macroStep.concat(this.getMacro("StartWonder")),e.macroStep=e.macroStep.concat(this.SelectInBox(this.state.currentColumn,this.state.currentRow)),e.macroStep=e.macroStep.concat(P("a",120,240,20)),this.state.state=k;break;case b:e.macroStep=[],this.state.currentColumn+=1,this.state.currentColumn>=6&&(this.state.currentColumn=0,this.state.currentRow+=1),this.state.traded+=1,e.macroStep=e.macroStep.concat(P("y",120,25e3,1)),this.state.traded<this.parameters.count?this.state.state=f:this.state.state=E}return this.state.progress=this.state.traded/this.parameters.count,e.state=this.state.state,e}}]),a}(G),q=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;Object(d.a)(this,a),(n=t.call(this,e,"Egg Hatcher","egghatcher_icon.png")).parameters.eggCycles=5,n.parameters.ability=!1,n.parameters.eggsInBox=1,n.onEggCyclesChange=n.onEggCyclesChange.bind(Object(l.a)(n)),n.onHasAbilityChange=n.onHasAbilityChange.bind(Object(l.a)(n)),n.onEggsInBoxChange=n.onEggsInBoxChange.bind(Object(l.a)(n)),n.paramHandlers={eggCycles:n.onEggCyclesChange,ability:n.onHasAbilityChange,eggsInBox:n.onEggsInBoxChange};var s=r.a.createElement("p",null,r.a.createElement("b",null,"1-")," Open your PC and navigate to the Box with the eggs. Make sure that the box was filled from up to down, left to right. This means the eggs should be placed column per column not row per row as is normal, if the box is full this doesn't matter.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"2-")," You must leave the ",r.a.createElement("b",null,"Pok\xe9mon")," option selected when exiting the game's menu.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"3-")," When starting the macro, the ",r.a.createElement("b",null,"Player Character")," must be near the ",r.a.createElement("b",null,"Nursery")," at the Wild Area and not on the bike.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"4-")," Set the ",r.a.createElement("b",null,"Egg Cycles")," parameter to how many cycles the egg takes to hatch, this can be checked on sites like Bulbapedia.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"5-")," Check the ",r.a.createElement("b",null,"Hatch Ability")," box if the first pokemon in the party has one of the following abilities: Flame Body, Magma Armor or Steam Engine.",r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("b",null,"6-")," Set the ",r.a.createElement("b",null,"Eggs in Box")," parameter to how many eggs you have in the box to be hatched.");return n.info=[{title:"SetUp",text:s}],n.state.phase=0,n.state.hatched=0,n.state.currentBatch=0,n}return Object(p.a)(a,[{key:"reset",value:function(){this.state.phase=0,this.state.hatched=0,this.state.currentBatch=0}},{key:"onEggCyclesChange",value:function(e){return e=5*(parseInt(e)+1),this.parameters.eggCycles!==e&&(this.parameters.eggCycles=e,!0)}},{key:"onHasAbilityChange",value:function(e){return this.parameters.ability!==e&&(this.parameters.ability=e,!0)}},{key:"onEggsInBoxChange",value:function(e){return this.parameters.eggsInBox!==e&&(this.parameters.eggsInBox=e,!0)}},{key:"WithdrawBatch",value:function(e){var t=this.getMacro("GetEggs"),a=t[0];a.macro[1].count=this.state.currentBatch,a.macro[3].count=this.state.currentBatch+1,t[0]=a;var n=t[0];return n.count=e,e>0&&(n.macro[1].count=this.state.currentBatch+1,n.macro[3].count=this.state.currentBatch+1),t[1]=n,t=t.concat(P("b",180,1720,2))}},{key:"HatchSegment",value:function(e){var t=this.getMacro("Hatching"),a=this.parameters.eggCycles;this.parameters.ability&&(a/=2);var n=6400*a;return t[0].macro[2].onTime=n,t[0].macro[3].onTime=n,t[1].count=e,t}},{key:"update",value:function(){var e={state:0,macroStep:void 0},t=0;switch(this.state.state===k&&(this.state.state=b),this.state.state){default:break;case f:e.macroStep=[],e.macroStep=e.macroStep.concat(this.getMacro("OpenBox")),t=Math.min(this.parameters.eggsInBox-this.state.hatched,5),e.macroStep=e.macroStep.concat(this.WithdrawBatch(t)),e.macroStep=e.macroStep.concat(this.getMacro("Recenter")),this.state.state=b;break;case b:switch(e.macroStep=[],this.state.phase){default:break;case 0:e.macroStep=e.macroStep.concat(this.HatchSegment(t)),this.state.phase=1;break;case 1:this.state.hatched+=t,t=0,this.state.currentBatch+=1,e.macroStep=e.macroStep.concat(P("x",180,840,1)),e.macroStep=e.macroStep.concat(P("right",180,240,1)),e.macroStep=e.macroStep.concat(P("up",180,240,1)),e.macroStep=e.macroStep.concat(P("b",180,1720,1)),e.macroStep=e.macroStep.concat(P("plus",180,1200,1)),this.state.hatched===this.parameters.eggsInBox?this.state.state=E:this.state.state=f,this.state.phase=0}}return this.state.progress=this.state.traded/this.parameters.count,e.state=this.state.state,e}}]),a}(G),Q=function(){function e(){Object(d.a)(this,e),this.state=y,this.onWait=!1,this.executing=null,this.commands=[]}return Object(p.a)(e,[{key:"execute",value:function(e){var t=c.a.mark((function e(t){var a,n,r,s,o,i,l,u,h,m,d,p;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a={state:this.state,abort:!1},n=0;case 2:if(!(n<t.length)){e.next=66;break}r=t[n],s=r.macro,o=r.count,i=0;case 7:if(!(i<o)){e.next=63;break}l=0;case 9:if(!(l<s.length)){e.next=60;break}case 10:if(this.state===w){e.next=19;break}return void(e.next=13);case 13:if(!(a=e.sent).abort){e.next=16;break}return e.abrupt("return");case 16:this.state=a.state,e.next=10;break;case 19:u=s[l],h=this.makeCommand(u.button,!0,u.strength,u.angle),m=this.makeCommand(u.button,!1,0,0),d=void 0===u.block||!0===u.block,p=0,p=0;case 25:if(!(p<u.count)){e.next=57;break}return this.commands.push(h),this.timedCommand(m,d,Math.max(u.onTime,20)),e.next=30,this.commands;case 30:this.commands=[];case 31:if(!this.onWait){e.next=40;break}return void(e.next=34);case 34:if(!(a=e.sent).abort){e.next=37;break}return e.abrupt("return");case 37:this.state=a.state,e.next=31;break;case 40:return!0===d&&u.offTime>0&&(this.onWait=!0,this.timedCommand(null,d,Math.max(u.offTime,20))),e.next=43,this.commands;case 43:this.commands=[];case 44:if(!this.onWait&&this.state!==j){e.next=53;break}return void(e.next=47);case 47:if(!(a=e.sent).abort){e.next=50;break}return e.abrupt("return");case 50:this.state=a.state,e.next=44;break;case 53:this.currentOverallStep++;case 54:p++,e.next=25;break;case 57:l++,e.next=9;break;case 60:i++,e.next=7;break;case 63:n++,e.next=2;break;case 66:return e.abrupt("return");case 67:case"end":return e.stop()}}),e,this)}));this.executing=function(e,t,a){var n=e.apply(t,a);return n.next(),function(e){return n.next(e)}}(t,this,[e])}},{key:"makeCommand",value:function(e,t,a,n){return{button:e,pressed:t,strength:a,angle:n}}},{key:"timedCommand",value:function(e,t,a){setTimeout(this.issueCommand,a,this,e,t),this.onWait=t}},{key:"issueCommand",value:function(e,t,a){null!==t&&e.commands.push(t),a&&(e.onWait=!1)}},{key:"reset",value:function(){this.state=S,this.onWait&&(this.onWait=!1,clearTimeout(this.waitTimeout),this.waitTimeout=null),null!==this.executing&&(this.executing({state:this.state,abort:!0}),this.executing=null)}}]),e}(),V=function(){function e(){Object(d.a)(this,e),this.state={selectedMacro:0,playState:S,macroProgress:0,macroDuration:0,macroRunTime:0,loadConcluded:!1},this.jsonManager=new Y,this.controllers=[],this.controllers[0]=new z(this.jsonManager),this.controllers[1]=new X(this.jsonManager),this.controllers[2]=new q(this.jsonManager),this.selectMacro=this.selectMacro.bind(this),this.changeParameter=this.changeParameter.bind(this),this.executer=new Q}return Object(p.a)(e,[{key:"checkLoadConcluded",value:function(){this.state.loadConcluded=this.jsonManager.loadConcluded}},{key:"selectMacro",value:function(e){if(this.state.selectedMacro===e)return!1;new Audio(v.a).play();var t=this.controllers[this.state.selectedMacro];return t.getMacroState()!==y&&(t.reset(),this.state.playState=S,this.state.macroProgress=0,this.executer.reset()),this.state.selectedMacro=e,!0}},{key:"changeParameter",value:function(e,t){this.controllers[this.state.selectedMacro].changeParameter(e,t)}},{key:"play",value:function(){switch(this.state.playState){default:case C:case w:return!1;case j:return void 0!==this.executer.executing?this.state.playState=w:this.state.playState=C,!0;case S:case x:this.reset();var e=this.controllers[this.state.selectedMacro];return e.start(),this.state.macroDuration=e.getDuration(),this.state.macroRunTime=0,this.state.playState=C,!0}}},{key:"pause",value:function(){return(this.state.playState===C||this.state.playState===w)&&(this.state.playState=j,!0)}},{key:"reset",value:function(){var e=this.controllers[this.state.selectedMacro];return this.state.playState!==S&&(e.reset(),this.state.playState=S,this.state.macroProgress=0,this.state.macroDuration=0,this.state.macroRunTime=0,!0)}},{key:"getMacroState",value:function(){return{macroState:this.state.playState,macroProgress:this.state.macroProgress,macroDuration:this.state.macroDuration,macroRunTime:this.state.macroRunTime}}},{key:"getAllMacroData",value:function(){for(var e=[],t=0;t<this.controllers.length;t++){var a=this.controllers[t];e[t]=a.getRenderData()}return e}},{key:"getMacroRenderData",value:function(){return this.controllers[this.state.selectedMacro].getRenderData()}},{key:"update",value:function(e){var t=void 0,a=void 0;if(this.state.loadConcluded||this.checkLoadConcluded(),this.state.loadConcluded){var n=this.controllers[this.state.selectedMacro];if(this.state.playState===C){var r=n.update(e);if(this.state.macroProgress=100*n.getMacroProgress(),void 0!==r&&null!==r){var s=r.macroStep;void 0!==s&&(this.executer.execute(s),this.state.playState=w)}}switch(this.state.playState){default:return;case w:this.state.macroRunTime+=20,a=this.executer.executing({state:this.state.playState,abort:!1});break;case j:void 0!==this.executer.executing&&(a=this.executer.executing({state:this.state.playState,abort:!1}))}if(void 0!==a&&(void 0!==a.value&&(t=a.value),a.done)){switch(n.getMacroState()){default:this.state.playState=C;break;case k:this.state.playState=j;break;case E:this.state.playState=x}this.executer.executing=void 0}}return t}}]),e}(),Z=function(){function e(){Object(d.a)(this,e),this.keys={a:{pressed:!1,pendingLog:null},b:{pressed:!1,pendingLog:null},x:{pressed:!1,pendingLog:null},y:{pressed:!1,pendingLog:null},l:{pressed:!1,pendingLog:null},lsl:{pressed:!1,pendingLog:null},lsr:{pressed:!1,pendingLog:null},r:{pressed:!1,pendingLog:null},rsl:{pressed:!1,pendingLog:null},rsr:{pressed:!1,pendingLog:null},plus:{pressed:!1,pendingLog:null},minus:{pressed:!1,pendingLog:null},up:{pressed:!1,pendingLog:null},right:{pressed:!1,pendingLog:null},left:{pressed:!1,pendingLog:null},down:{pressed:!1,pendingLog:null},left_stick:{pressed:!1,pendingLog:null},right_stick:{pressed:!1,pendingLog:null},left_stick_dir:{pressed:!1,pendingLog:null},right_stick_dir:{pressed:!1,pendingLog:null},home:{pressed:!1,pendingLog:null}},this.startTime=0,this.log=[],this.log_count=0}return Object(p.a)(e,[{key:"clear",value:function(){this.keys={a:{pressed:!1,pendingLog:null},b:{pressed:!1,pendingLog:null},x:{pressed:!1,pendingLog:null},y:{pressed:!1,pendingLog:null},l:{pressed:!1,pendingLog:null},lsl:{pressed:!1,pendingLog:null},lsr:{pressed:!1,pendingLog:null},r:{pressed:!1,pendingLog:null},rsl:{pressed:!1,pendingLog:null},rsr:{pressed:!1,pendingLog:null},plus:{pressed:!1,pendingLog:null},minus:{pressed:!1,pendingLog:null},up:{pressed:!1,pendingLog:null},right:{pressed:!1,pendingLog:null},left:{pressed:!1,pendingLog:null},down:{pressed:!1,pendingLog:null},left_stick:{pressed:!1,pendingLog:null},right_stick:{pressed:!1,pendingLog:null},left_stick_dir:{pressed:!1,pendingLog:null},right_stick_dir:{pressed:!1,pendingLog:null},home:{pressed:!1,pendingLog:null}},this.startTime=0,this.log=[],this.log_count=0}},{key:"pressKey",value:function(e,t){if("buffer"!==e){var a=this.keys[e];!1===a.pressed&&(a.pressed=!0,0===this.startTime&&(this.startTime=t),a.pendingLog=this.addLogEntry(e,t-this.startTime)),this.keys[e]=a}}},{key:"addLogEntry",value:function(e,t){var a={index:this.log_count,key:e,start:t,duration:0};return this.log[this.log_count]=a,this.log_count++,a}},{key:"releaseKey",value:function(e,t){if("buffer"!==e){var a=this.keys[e];if(!0===a.pressed){a.pressed=!1;var n=a.pendingLog;a.pendingLog=null,n.duration=t-n.start-this.startTime,this.log[n.index]=n}}}},{key:"getPressed",value:function(){var e=[];for(var t in this.keys){!0===this.keys[t].pressed&&e.push(t)}return e}},{key:"update",value:function(e,t){var a=(new Date).getTime();t?this.pressKey(e,a):this.releaseKey(e,a)}},{key:"renderPressed",value:function(){for(var e=Object.entries(this.keys),t=[],a=0,n=0;n<e.length;n++){var s=e[n];!0===s[1].pressed&&(t[a]=r.a.createElement("div",{className:"pressedKey",key:s[0]},s[0]),a++)}return r.a.createElement("div",{id:"PressedKeys"},r.a.createElement("b",null," Pressed "),t)}},{key:"renderLogged",value:function(){var e=[];if(this.log_count>0)for(var t=0;t<Math.min(3,this.log_count);t++){var a=this.log[this.log_count-(t+1)];e.push(r.a.createElement(H,{key:"keylog_"+t,index:a.index.toString(),pressedKey:a.key,start:a.start,duration:a.duration}))}return r.a.createElement("div",{id:"KeyLogs"},e)}}]),e}(),$=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).state={},n.onButtonEvent=n.onButtonEvent.bind(Object(l.a)(n)),n.selectMacro=n.selectMacro.bind(Object(l.a)(n)),n.parameterChange=n.parameterChange.bind(Object(l.a)(n)),n.macroPlayer=new V,n.keyLogger=new Z,n.currentTime=0,n.state={displayStartM:!0,selectedMacro:0,macroState:-1,macroProgress:0,macroDuration:0,macroRunTime:0,displayInfo:!1},n}return Object(p.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.UpdateTimerId=setInterval((function(){return e.update()}),20)}},{key:"componentWillUnmount",value:function(){clearInterval(this.UpdateTimerId)}},{key:"update",value:function(){this.currentTime+=20;var e,t=this.macroPlayer.update(this.currentTime);if(this.setState(this.macroPlayer.getMacroState()),void 0!==t)for(e=0;e<t.length;e++){var a=t[e];console.log(a),"right_stick_dir"===a.button||"left_stick_dir"===a.button?this.handleSwitchJoySticks(a.button,a.strength,a.angle):this.handleSwitchKeys(a.button,a.pressed),this.keyLogger.update(a.button,a.pressed)}}},{key:"onButtonEvent",value:function(e){switch(new Audio("/PokemonMacrosJoyConDroid/assets/click.mp3").play(),e){default:return;case"startMessage":var t=!this.state.displayStartM;this.setState({displayStartM:t});break;case"play":this.macroPlayer.play();break;case"pause":this.macroPlayer.pause();break;case"reset":if(this.macroPlayer.reset()){var a,n=this.keyLogger.getPressed();for(a=0;a<n.length;a++){var r=n[a];"left_stick_dir"===r||"right_stick_dir"===r?this.handleSwitchJoySticks(r,0,0):this.handleSwitchKeys(r,!1)}this.keyLogger.clear()}break;case"info":var s=!this.state.displayInfo;this.setState({displayInfo:s})}this.setState(this.macroPlayer.getMacroState())}},{key:"selectMacro",value:function(e){this.macroPlayer.selectMacro(e)&&this.keyLogger.clear()}},{key:"parameterChange",value:function(e,t){this.macroPlayer.changeParameter(e,t)}},{key:"handleSwitchJoySticks",value:function(e,t,a){var n=function(e){return e*(Math.PI/180)}(a);void 0!==window.joyconJS&&("right_stick_dir"===e&&window.joyconJS.onRightJoystick(t,n),"left_stick_dir"===e&&window.joyconJS.onLeftJoystick(t,n))}},{key:"handleSwitchKeys",value:function(e,t){void 0!==window.joyconJS&&("minus"===e&&window.joyconJS.onMinus(t),"left-stick"===e&&window.joyconJS.onLeftJoystickPressed(t),"up"===e&&window.joyconJS.onUp(t),"right"===e&&window.joyconJS.onRight(t),"down"===e&&window.joyconJS.onDown(t),"left"===e&&window.joyconJS.onLeft(t),"l"===e&&window.joyconJS.onL(t),"lsl"===e&&window.joyconJS.onLeftSL(t),"lsr"===e&&window.joyconJS.onLeftSR(t),"plus"===e&&window.joyconJS.onPlus(t),"a"===e&&window.joyconJS.onA(t),"b"===e&&window.joyconJS.onB(t),"x"===e&&window.joyconJS.onX(t),"y"===e&&window.joyconJS.onY(t),"r"===e&&window.joyconJS.onR(t),"rsl"===e&&window.joyconJS.onRightSL(t),"rsr"===e&&window.joyconJS.onRightSR(t),"right-stick"===e&&window.joyconJS.onRightJoystickPressed(t),"home"===e&&window.joyconJS.onHome(t))}},{key:"renderStartMessage",value:function(){var e=this,t=r.a.createElement("b",null,' "lorem ipsum" ');return r.a.createElement("div",{id:"Start Message"},r.a.createElement(U,{show:this.state.displayStartM,title:"Welcome",sections:t,onMouseDown:function(t){return e.onButtonEvent("startMessage")},onTouchStart:function(t){return e.onButtonEvent("startMessage")}}))}},{key:"renderMacros",value:function(){var e=this;if(!this.macroPlayer.state.loadConcluded)return r.a.createElement("b",null," Loading ");var t=this.macroPlayer.state.selectedMacro,a=this.macroPlayer.getAllMacroData(),n=-1;return a.map((function(a){n++;var s=t===n;return r.a.createElement(A,{key:"macro_"+n.toString(),index:n,selected:s,name:a.name,src:a.icon,clickHandler:e.selectMacro})}))}},{key:"renderParameters",value:function(){if(!this.macroPlayer.state.loadConcluded)return r.a.createElement("b",null," Loading ");var e=this.macroPlayer.getMacroRenderData();return r.a.createElement(W,{key:"macroParams",macro:e.name,parameters:e.parameters,eventHandler:this.parameterChange})}},{key:"renderStatus",value:function(){if(!this.macroPlayer.state.loadConcluded)return r.a.createElement("b",null," Loading ");var e=this.macroPlayer.getMacroRenderData();return r.a.createElement(K,{key:"macroStatus",macro:e.name,status:e.state})}},{key:"renderInfo",value:function(){var e=this,t=this.macroPlayer.getMacroRenderData(),a=t.name,n=t.info;return r.a.createElement("div",{id:"Info"},r.a.createElement("button",{className:"info-button",id:"InfoButton",onMouseUp:function(t){return e.onButtonEvent("info")},onTouchStart:function(t){return e.onButtonEvent("info")}},"Info"),r.a.createElement(U,{show:this.state.displayInfo,title:a,sections:n,onMouseUp:function(t){return e.onButtonEvent("info")},onTouchStart:function(t){return e.onButtonEvent("info")}}))}},{key:"renderTime",value:function(){var e=Math.floor(this.state.macroRunTime/6e4);e<10&&(e="0"+e);var t=Math.floor(this.state.macroRunTime%6e4/1e3);t<10&&(t="0"+t);var a=this.state.macroRunTime%6e4%1e3;a<10?a="000"+a:a<100?a="00"+a:a<1e3&&(a="0"+a);var n=e+":"+t+":"+a,s=Math.floor(this.state.macroDuration/6e4);s<10&&(s="0"+s);var o=Math.floor(this.state.macroDuration%6e4/1e3);o<10&&(o="0"+o);var i=this.state.macroDuration%6e4%1e3;i<10?i="000"+i:i<100?i="00"+i:i<1e3&&(i="0"+i);var c=n+" / "+(s+":"+o+":"+i);return r.a.createElement("div",{id:"MacroTime"},c)}},{key:"render",value:function(){var e=this,t=this.renderStartMessage(),a=this.renderMacros(),n=this.renderParameters(),s=this.renderStatus(),o=this.renderInfo(),i=this.renderTime(),c=this.macroPlayer.state.playState;return r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"App-header"},r.a.createElement("img",{className:"app-icon",alt:"AppIcon",src:"/PokemonMacrosJoyConDroid/assets/images/macro_app_icon.png"}),r.a.createElement("b",{className:"App-title",style:{color:"black"}}," POK\xc9MACROS ")),r.a.createElement("div",{id:"body"},t,r.a.createElement("div",{id:"Macros"},a),r.a.createElement("div",{id:"MacroInfo"},n,r.a.createElement("br",null),s,r.a.createElement("br",null),o),r.a.createElement("div",{id:"Player"},r.a.createElement(I,{key:"progressbar",percentage:this.state.macroProgress}),i,r.a.createElement("div",{id:"PlayerButtons"},r.a.createElement(B,{id:"ResetButton",selected:c===y,name:"Reset",src:"/PokemonMacrosJoyConDroid/assets/images/reset_icon.png",clickHandler:function(t){return e.onButtonEvent("reset")}}),r.a.createElement(B,{id:"PlayButton",selected:c===b,name:"Play",src:"/PokemonMacrosJoyConDroid/assets/images/play_icon.png",clickHandler:function(t){return e.onButtonEvent("play")}}),r.a.createElement(B,{id:"PauseButton",selected:c===k,name:"Pause",src:"/PokemonMacrosJoyConDroid/assets/images/pause_icon.png",clickHandler:function(t){return e.onButtonEvent("pause")}})))))}}]),a}(n.Component);a(18);o.a.render(r.a.createElement($,null),document.getElementById("root"))}},[[11,1,2]]]);
//# sourceMappingURL=main.f0226193.chunk.js.map