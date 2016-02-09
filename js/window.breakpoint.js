(function(jQuery, window) {
	"use strict";

	var win = jQuery(window);
	var doc = jQuery(document);
	var rules = [];
	var rem = /(\d*\.?\d+)r?em/;
	var rpercent = /(\d*\.?\d+)%/;
	var width, height, scrollTop, scrollHeight, fontSize;

	var types = {
		number: function(n) { return n; },

		function: function(fn) { return fn(); },

		string: function(string) {
			var data, n;

			data = rem.exec(value);
			if (data) {
				n = parseFloat(data[1]);
				return getFontSize() * n;
			}

			data = rpercent.exec(value);
			if (data) {
				n = parseFloat(data[1]) / 100;
				return width * n;
			}

			throw new Error('[window.breakpoint] \'' + value + '\' cannot be parsed as rem, em or %.');
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

	function testProperty(property, value) {
		cutoffs[property]
	}

	function test(query) {
		var key;

		for (key in query) {
			if (!query.hasOwnProperty(key)) { continue; }
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
		scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		update();
	}

	function resize(e) {
		width = window.innerWidth;
		height = window.innerHeight;
		scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
		update();
	}

	win
	.on('scroll', scroll)
	.on('resize', resize);

	doc
	.ready(update)
	.on('DOMContentLoaded', update);

	width = window.innerWidth;
	height = window.innerHeight;
	scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

	window.breakpoint = media;
})(jQuery, window);
