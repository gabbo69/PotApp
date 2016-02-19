/*
 *  jquery.potTable.js
 *  
 *	 Pot App pot.potTable
 *
 *  Created by Julian Kleine on 15. Jan 2016.
 *  Copyright Gabriel Seitz. All rights reserved.
 *
 */

$.widget("pot.potTable", {

	// Variables/Options
	options: {
		inputTable: "inputTable",
		worker: {},
		weekdays: {
			"so": [],
			"mo": [],
			"di": [],
			"mi": [],
			"do": [],
			"fr": [],
			"sa": []
		},
		days: 0,
		month: 0,
		year: 0,

		list: [],
		classes: {
			'workerList': "workerList"
		}
	},

	// Initial function
	_create: function () {
		var month = {};
		var currentMonth = moment('01' + ' 0' + this.options.month + ' ' + this.options.year, "DD MM YYYY");

		//set days with moments.js
		var lastDayOfMonth = currentMonth.endOf('month').date();
		this.options.days = lastDayOfMonth;
		console.log("Jahr: " + this.options.year + " Monat: " + this.options.month + " Tage: " + this.options.days);



		for (var i = 0; i < this.options.days; i++) {
			this.options.list[i] = {
				workers: {
					theke: [],
					koch: []
				},
				notWorkers: {
					theke: [],
					koch: []
				},
				active: {
					theke: {},
					koch: {},
					meal: {}
				}
			};
		}

		// create weekdays
		this._weekdays(currentMonth);

		// reset
		this._resetBackend();
	},

	// ** private functions **

	// * create functions *

	// user Tablerow
	_createTableRow: function (day) {
		var date = new Date(2016, this.options.month - 1, day);
		var weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

		var startRow = '<tr id="tableDay' + date.getDate() + '"><th scope="row">';
		var th = ("0" + date.getDate()).slice(-2) + '.' + ("0" + (date.getMonth() + 1)).slice(-2) + ' - ' + weekdays[date.getDay()] + '</th>';

		startRow += th;
		var meal = '<td class="col-md-4">' +
			'<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
			'<span data-bind="label">Rezepte</span>&nbsp;<span class="caret"></span></button>' +
			'<ul class="dropdown-menu" role="menu"></ul></div></td>';

		var theke =
			'<td class="col-md-3">' +
			'<ul class="' + this.options.classes.workerList + ' theke">' +
			// LI ELEMENT Theke
			'</ul>' +
			'</td>';

		var koch =
			'<td class="col-md-3">' +
			'<ul class="' + this.options.classes.workerList + ' koch">' +
			// LI ELEMENT Koch
			'</ul>' +
			'</td>';


		var endRow = '</tr>';

		return startRow + meal + theke + koch + endRow;
	},

	// input Tablerow
	_createInputRow: function (theWorker) {
		var name = '<tr  id="row' + theWorker.id + '" ><td>' + theWorker.name + '</td>';
		var dates = '<td><input class="inputText" type="text"/></td>';
		var times = '<td><input  type="number" class="inputMax" min="0"/></td>';
		var theke = '<td><input class="inputT" type="checkbox"/></td>';
		var kueche = '<td><input class="inputK" type="checkbox"/></td>';
		var rezepte = '<td>';

		if (theWorker.koch) {
			for (var i = 0; i < theWorker.max; i++) {
				rezepte = rezepte + '<input class="inputMeal" type="text"/>';
			}
		}
		rezepte = rezepte + '</td></tr>';
		return name + dates + times + theke + kueche + rezepte;
	},

	// userTable 
	_createUserTable: function () {
		var table = $('table#tableUser tbody');

		for (var i = 0; i < this.options.days; i++) {
			var row = this._createTableRow(i + 1);
			table.append(row);
		}
	},

	// fill rows of userTable
	_createFrontend: function () {
		var list = this.options.list;
		var table = $('table#tableUser');


		for (var i = 0; i < list.length; i++) {

			var elementT = table.find("tr#tableDay" + (i + 1) + " ul.theke");
			var elementK = table.find("tr#tableDay" + (i + 1) + " ul.koch");
			var elementM = table.find("tr#tableDay" + (i + 1) + " ul.dropdown-menu");


			// alert if position is can not be filled
			if (list[i].workers.theke.length === 0) {
				elementT.parent().addClass("danger");
				//window.alert("Keine Thekenkraft am " + (i+1) + "ten! ");
			}
			if (list[i].workers.koch.length === 0) {
				elementK.parent().addClass("danger");
				//window.alert("Keine Küchenkraft am " + (i+1) + "ten! ");
			}

			// setActive if only one available
			if (list[i].workers.theke.length === 1) {
				list[i].workers.theke[0].count++;
				list[i].active.theke = list[i].workers.theke[0];
			}
			if (list[i].workers.koch.length === 1) {
				ist[i].workers.koch[0].count++;
				list[i].active.koch = list[i].workers.koch[0];
			}

			// set active elements
			var theke = list[i].active.theke;
			var listItemT;

			if (!jQuery.isEmptyObject(theke)) {
				listItemT = jQuery('<li class="workers active">' + theke.name + ' ' + theke.count + '/' + theke.max + '</li>');
				listItemT.data('worker', list[i].active.theke);
				elementT.append(listItemT);
			}

			var koch = list[i].active.koch;
			var listItemK;

			if (!jQuery.isEmptyObject(koch)) {
				listItemK = jQuery('<li class="workers active">' + koch.name + ' ' + koch.count + '/' + koch.max + '</li>');
				listItemK.data('worker', list[i].active.koch);
				elementK.append(listItemK);

				for (var m = 0; m < koch.rezepte.length; m++) {
					var listItemM = jQuery('<li><a href="#">' + koch.rezepte[m] + '</a></li>');
					elementM.append(listItemM);
				}
			}

			// set unactive elements
			theke = list[i].workers.theke;
			var notTheke = list[i].notWorkers.theke;


			for (var j = 0; j < theke.length; j++) {
				var not = false;
				//  if has dates left and not active
				if (theke[j].max > theke[j].count && theke[j].id != list[i].active.theke.id) {
					for (var n = 0; n < notTheke.length; n++) {

						if (notTheke[n].id == theke[j].id) {
							not = true;
						}
					}

					// if not in notWorker 
					if (!not) {
						listItemT = jQuery('<li class="workers">' + theke[j].name + ' ' + theke[j].count + '/' + theke[j].max + '</li>');
						listItemT.data('worker', theke[j]);
						elementT.append(listItemT);
					}
				}
			}

			koch = list[i].workers.koch;
			var notKoch = list[i].notWorkers.koch;

			for (var k = 0; k < koch.length; k++) {
				var not = false;
				// if has dates left and not active

				if (koch[k].max > koch[k].count && koch[k].id != list[i].active.koch.id) {
					for (var n = 0; n < notKoch.length; n++) {
						if (notKoch[n].id == koch[k].id) {
							not = true;
						}
					}

					// if not in notWorker
					if (!not) {
						listItemK = jQuery('<li class="workers">' + koch[k].name + ' ' + koch[k].count + '/' + koch[k].max + '</li>');
						listItemK.data('worker', koch[k]);
						elementK.append(listItemK);
					}
				}
			}
		}
	},


	// * reset functions *
	_resetFrontend: function () {

		// reset workerList, notWorkerList, meal
		for (var i = 0; i < this.options.days; i++) {
			var table = $("#tableDay" + (i + 1) + " ul." + this.options.classes.workerList);
			table.empty();
			var meals = $("#tableDay" + (i + 1) + " ul.dropdown-menu");
			meals.empty();
			this.options.list[i].active.meal = {};
		}
	},

	_resetBackend: function () {
		// reset list[]
		for (var i = 0; i < this.options.days; i++) {
			this.options.list[i] = {
				workers: {
					theke: [],
					koch: []
				},
				notWorkers: {
					theke: [],
					koch: []
				},
				active: {
					theke: {},
					koch: {},
					meal: {}
				}
			};
		}

		//reset count
		for (var i = 0; i < this.options.worker.length; i++) {
			this.options.worker[i].count = 0;
		}
	},

	// * other functions *
	_weekdays: function (currentMonth) {
		// iterate all days of the current month
		for (var i = 1; i < this.options.days + 1; i++) {
			currentMonth.date(i);
			var numberToWeek = ["so", "mo", "di", "mi", "do", "fr", "sa"];
			var currWeekday = numberToWeek[currentMonth.weekday()];
			this.options.weekdays[currWeekday].push(currentMonth.date());
		}
	},

	// 
	_checkDates: function () {

		//call save function every date from every worker
		for (var j = 0; j < this.options.worker.length; ++j) {
			var currentWorker = this.options.worker[j];
			var dates = currentWorker.dates.split(",");
			var max = currentWorker.max;
			// <-- work on input **
			var isNot = false;
			var isChar = false;
			var currentWord = "";
			// iterate string containing dates
			for (var i = 0; i < dates.length; i++) {
				// set variables
				currentDay = dates[i];
				isNot = false;
				isChar = false;

				// check on negation
				if (dates[i].charAt(0) == "!") {
					// ** negiert
					isNot = true;
					// change currentDay, abandon "!"
					currentDay = currentDay.substr(1, 2);
				}

				// check on char
				if (isNaN(currentDay)) {
					isChar = true;
					currentDay = this.options.weekdays[currentDay];
				}

				// save
				if (isChar) {
					// its an array        
					for (var k = 0; k < currentDay.length; k++) {
						this._save(currentDay[k], currentWorker, isNot);
					}
				} else {
					// its not
					this._save(currentDay, currentWorker, isNot);
				}
			}

		}

	},

	// read data from inputTable and save in worker
	_read: function () {
		var table = $('table#' + this.options.inputTable + ' tbody tr');
		var base = this.options;

		table.each(function (i) {
			var text = $(this).find(".inputText").val();
			var max = $(this).find(".inputMax").val();
			var theke = $(this).find(".inputT").is(":checked");
			var kueche = $(this).find(".inputK").is(":checked");
			var rezepte = [];

			if (base.worker[i].koch) {
				$(this).find(".inputMeal").each(function () {
					rezepte.push(($(this).val()));
				});
			}

			base.worker[i].dates = text;
			base.worker[i].max = max;
			base.worker[i].theke = theke;
			base.worker[i].koch = kueche;
			base.worker[i].count = 0;
			base.worker[i].rezepte = rezepte;
		});
	},

	// write dates into list[]
	_save: function (day, theWorker, isNot) {
		var list = this.options.list;
		var isDouble = false;
		var entryK = {};
		var entryT = {};
		var isTheke = theWorker.theke;
		var isKoch = theWorker.koch;


		// if its a "can not" entry
		if (isNot) {
			if (isTheke) {
				entryT = list[day - 1].notWorkers.theke;
			}
			if (isKoch) {
				entryK = list[day - 1].notWorkers.koch;
			}

			// "can" entry
		} else {
			if (isTheke) {
				entryT = list[day - 1].workers.theke;
			}
			if (isKoch) {
				entryK = list[day - 1].workers.koch;
			}
		}

		// check if entry is already there, push entry 
		if (isTheke) {
			for (var h = 0; h < entryT.length; h++) {
				if (entryT[h].id == theWorker.id) {
					isDouble = true;
				}
			}
			if (!isDouble) {
				entryT.push(theWorker);
			}
		}

		if (isKoch) {
			for (var h = 0; h < entryK.length; h++) {
				if (entryK[h].id == theWorker.id) {
					isDouble = true;
				}
			}

			if (!isDouble) {
				entryK.push(theWorker);
			}
		}

	},


	// update
	_updateTable: function () {

		// reset
		this._resetFrontend();

		//append rest of worker
		this._createFrontend();

		console.log("potTable refreshed.");

	},



	// ** public functions **

	loadTable: function () {

		this._createUserTable();

		//save Dates and show them
		this._checkDates();
		this._createFrontend();

		console.log("potTable loaded.");

	},

	reloadTable: function () {

		// reset 
		this._resetBackend();
		this._resetFrontend();

		//save Dates and show them
		this._checkDates();
		this._createFrontend();

		console.log("potTable reloaded.");

	},

	setMeal: function (element) {
		var currentDay = $(element).closest('tr').attr('id');
		currentDay = currentDay.replace("tableDay", "");

		this.options.list[currentDay - 1].active.meal = $(element).text();
		console.log(this.options.list[currentDay - 1].active.meal);

	},

	setActive: function (item) {
		var theWorker = $(item).data('worker');
		var role = $(item).parent().hasClass('theke') ? "theke" : "koch";
		var currentDay = $(item).closest('tr').prop('id').replace("tableDay", "");
		var activeList = this.options.list[currentDay - 1].active;
		var currentActive;

		theWorker.count++;

		if (role == "theke") {

			// check if active in other role
			if (activeList.koch.id == theWorker.id) {
				activeList.koch.count--;
				activeList.koch = {};
			}

			// reset current active count 
			currentActive = $(item).parent().find('li.active');
			if (!jQuery.isEmptyObject(currentActive.data('worker'))) {
				activeList.theke.count--;
			}

			// set active 
			activeList.theke = theWorker;
		}

		if (role == "koch") {
			if (activeList.theke.id == theWorker.id) {
				activeList.theke.count--;
				activeList.theke = {};
			}
			currentActive = $(item).parent().find('li.active');
			if (!jQuery.isEmptyObject(currentActive.data('worker'))) {
				activeList.koch.count--;
			}
			activeList.koch = theWorker;


		}

		// update
		this._updateTable();
	},

	setNotActive: function (item) {
		var currentDay = $(item).closest('tr').prop('id').replace("tableDay", "");
		var theWorker = $(item).data('worker');

		theWorker.count--;


		if ($(item).closest('ul').hasClass("theke")) {
			this.options.list[currentDay - 1].active.theke = {};
		} else {
			this.options.list[currentDay - 1].active.koch = {};
		}

		//update
		this._updateTable();

	},

	loadWorker: function () {
		var table = $('table#' + this.options.inputTable + ' tbody');
		for (var i = 0; i < this.options.worker.length; i++) {
			worker = this.options.worker[i];
			var row = this._createInputRow(worker);
			table.append(row);
			row = table.find("tr#" + "row" + i);
			row.data('worker', worker);

			// set default value on checkboxes
			table.find('tr#' + "row" + worker.id + ' td' + ' input.inputT').prop("checked", worker.theke);
			table.find('tr#' + "row" + worker.id + ' td' + ' input.inputK').prop("checked", worker.koch);

			// TEST VARIABLES
			table.find('tr#' + "row" + worker.id + ' td' + ' input.inputMax').val(worker.max);
			table.find('tr#' + "row" + worker.id + ' td' + ' input.inputText').val(worker.dates);
		}
	},

	readWorker: function () {
		// read input
		this._read();
	},

	getFile: function () {
		var object = {
			pot: {
				month: {},
				year: {},
				days: {},
				worker: {},
				list: {}
			}
		};
		object.pot.month = (this.options.month);
		object.pot.year = (this.options.year);
		object.pot.days = (this.options.days);
		object.pot.worker = (this.options.worker);
		object.pot.list = (this.options.list);

		return object;
	},

	setList: function (list) {
		this.options.list = list;
		this._createUserTable();
		this._updateTable();

	},

	loadPreviewTable: function () {
		var list = this.options.list;
		var numberToWeek = ["so", "mo", "di", "mi", "do", "fr", "sa"];
		for (var i = 0; i < list.length; i++) {

			var day;
			var datum;
			day = moment(i + 1 + " " + this.options.month + ' ' + this.options.year, "DD MM YYYY");
			var weekday = numberToWeek[(day.day()) % 7];


			if (weekday == "sa" || weekday == "so") {
				datum = '<tr class="info"><td>' + (i + 1) + '. ' + weekday + '</td>';
			} else {
				datum = '<tr><td>' + (i + 1) + '. ' + weekday + '</td>';
			}
			var art = '<td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
				'<span data-bind="label">art</span>&nbsp;<span class="caret"></span></button>' +
				'<ul class="dropdown-menu" role="menu">' + '<li><img href="#"  width="50%" height="50%" src="../lib/images/animals/chicken.svg" alt="chicken"></li>' + '</ul></div>';
			var gericht = '<input type= "text" value="' + list[i].active.meal + '"></input><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
				'<span data-bind="label"></span>&nbsp;<span class="caret"></span></button>' +
				'<ul class="dropdown-mealsort" role="menu"></ul></div></td>';
			var theke = '<td><input type= "text" value="' + list[i].active.theke.name + '"></input></td>';
			var koch = '<td><input type= "text" value="' + list[i].active.koch.name + '"></input></td></tr>';
			var row = datum + art + gericht + theke + koch;

			$('table#tablePreview tbody').append(row);
		}


	}
});