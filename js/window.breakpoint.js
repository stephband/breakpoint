(function(jQuery, window) {
	"use strict";

	var win = jQuery(window);
	var doc = jQuery(document);
	var fontSize = 16;
	var rules = [];
	var rem = /(\d*\.?\d+)r?em/;
	var rpercent = /(\d*\.?\d+)%/;
	var width, height, scrollTop, scrollHeight;

	function getStyle(node, name) {
		return window.getComputedStyle ?
			window
			.getComputedStyle(node, null)
			.getPropertyValue(name) :
			0 ;
	}

	function getFontSize() {
		return fontSize ||
			(fontSize = parseInt(getStyle(document.documentElement, "font-size"), 10));
	}

	function parse(query) {
		var data, n;

		if (typeof query === 'number') {
			return function numberQuery() { return query; };
		}

		if (typeof query === 'string') {
			data = rem.exec(query);
			if (data) {
				n = parseFloat(data[1]);
				return function remQuery() { return getFontSize() * n; };
			}

			data = rpercent.exec(query);
			if (data) {
				n = parseFloat(data[1]) / 100;
				return function percentQuery() { return width * n; };
			}

			throw new Error('[window.breakpoint] \'' + query + '\' cannot be parsed.');
		}

		// Assume query is a function
		return query;
	}

	function media(query, fn1, fn2) {
		var rule = {};
		var key;

		for (key in query) {
			if (!query.hasOwnProperty(key)) { continue; }
			rule[key] = parse(query[key]);
		}

		rule.enter = fn1;
		rule.exit = fn2;
		rules.push(rule);
	}

	function test(rule) {
		if (rule.minWidth        && width <  rule.minWidth()) { return false; }
		if (rule.maxWidth        && width >= rule.maxWidth()) { return false; }
		if (rule.minHeight       && height <  rule.minHeight()) { return false; }
		if (rule.maxHeight       && height >= rule.maxHeight()) { return false; }
		if (rule.minScrollTop    && scrollTop <  rule.minScrollTop()) { return false; }
		if (rule.maxScrollTop    && scrollTop >= rule.maxScrollTop()) { return false; }
		if (rule.minScrollBottom && (scrollHeight - height - scrollTop) <  rule.minScrollBottom()) { return false; }
		if (rule.maxScrollBottom && (scrollHeight - height - scrollTop) >= rule.maxScrollBottom()) { return false; }

		return true;
	}

	function update() {
		var l = rules.length;
		var rule;

		// Run exiting rules
		while (l--) {
			rule = rules[l];

			if (rule.state && !test(rule)) {
				rule.state = false;
				rule.exit();
			}
		}

		l = rules.length;

		// Run entering rules
		while (l--) {
			rule = rules[l];

			if (!rule.state && test(rule)) {
				rule.state = true;
				rule.enter();
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
