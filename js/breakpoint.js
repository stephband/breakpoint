(function(window) {
	"use strict";

	var dom = window.dom;
	var rules = [];
	var rem = /(\d*\.?\d+)r?em/;
	var rpercent = /(\d*\.?\d+)%/;
	var width, height, scrollTop, scrollHeight, fontSize;

	var types = {
		number: function(n) { return n; },

		function: function(fn) { return fn(); },

		string: function(string) {
			var data, n;

			data = rem.exec(string);
			if (data) {
				n = parseFloat(data[1]);
				return getFontSize() * n;
			}

			data = rpercent.exec(string);
			if (data) {
				n = parseFloat(data[1]) / 100;
				return width * n;
			}

			throw new Error('[window.breakpoint] \'' + string + '\' cannot be parsed as rem, em or %.');
		}
	};

	var tests = {
		minWidth: function(value)  { return width >= types[typeof value](value); },
		maxWidth: function(value)  { return width <  types[typeof value](value); },
		minHeight: function(value) { return height >= types[typeof value](value); },
		maxHeight: function(value) { return height <  types[typeof value](value); },
		minScrollTop: function(value) { return scrollTop >= types[typeof value](value); },
		maxScrollTop: function(value) { return scrollTop <  types[typeof value](value); },
		minScrollBottom: function(value) { return (scrollHeight - height - scrollTop) >= types[typeof value](value); },
		maxScrollBottom: function(value) { return (scrollHeight - height - scrollTop) <  types[typeof value](value); }
	};

	function getStyle(node, name) {
		return window.getComputedStyle ?
			window
			.getComputedStyle(node, null)
			.getPropertyValue(name) :
			0 ;
	}

	function getFontSize() {
		return fontSize ||
			(fontSize = parseFloat(getStyle(document.documentElement, "font-size"), 10));
	}

	function media(query, fn1, fn2) {
		var rule = {};

		rule.query = query;
		rule.enter = fn1;
		rule.exit = fn2;
		rules.push(rule);

		return query;
	}

	function test(query) {
		var keys = Object.keys(query);
		var n = keys.length;
		var key;

		if (keys.length === 0) { return false; }

		while (n--) {
			key = keys[n];
			if (!tests[key](query[key])) { return false; }
		}

		return true;
	}

	function update() {
		var l = rules.length;
		var rule;

		// Run exiting rules
		while (l--) {
			rule = rules[l];

			if (rule.state && !test(rule.query)) {
				rule.state = false;
				rule.exit && rule.exit();
			}
		}

		l = rules.length;

		// Run entering rules
		while (l--) {
			rule = rules[l];

			if (!rule.state && test(rule.query)) {
				rule.state = true;
				rule.enter && rule.enter();
			}
		}
	}

	function scroll(e) {
		scrollTop = dom.view.scrollTop;
		update();
	}

	function resize(e) {
		width = window.innerWidth;
		height = window.innerHeight;
		scrollHeight = dom.view.scrollHeight;
		update();
	}

	dom.event('scroll', window).each(scroll);
	dom.event('resize', window).each(scroll);
	dom.ready(update);

	width = window.innerWidth;
	height = window.innerHeight;
	scrollTop = dom.view.scrollTop;
	scrollHeight = dom.view.scrollHeight;

	window.breakpoint = media;
})(this);
