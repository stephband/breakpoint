(function(jQuery, window) {
	var win = jQuery(window);
	var fontSize = 16;
	var rules = [];
	var rem = /(\d*\.?\d+)r?em/;
	var rpercent = /(\d*\.?\d+)%/;
	var width, height, scrollTop, fontSize;
	
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
		var data;
		
		if (typeof query === 'number') { return query; }
		
		data = rem.exec(query);
		if (data) { return getFontSize() * parseFloat(data[1]); }
		
		data = rpercent.exec(query);
		if (data) { return width * parseFloat(data[1]) / 100; }
		
		throw new Error('[window.breakpoint] \'' + query + '\' cannot be parsed.');
	}
	
	function media(query, fn1, fn2) {
		var rule = {
			minWidth:  query.minWidth  && parse(query.minWidth),
			maxWidth:  query.maxWidth  && parse(query.maxWidth),
			minScroll: query.minScroll && parse(query.minScroll),
			maxScroll: query.maxScroll && parse(query.maxScroll),
			minHeight: query.minHeight && parse(query.minHeight),
			maxHeight: query.maxHeight && parse(query.maxHeight),
			enter: fn1,
			exit: fn2
		};
		
		rule.state = test(rule);
		rules.push(rule);
		rule.state ? rule.enter() : rule.exit();
	}
	
	function test(rule) {
		if (rule.minWidth && width <  rule.minWidth) { return false; }
		if (rule.maxWidth && width >= rule.maxWidth) { return false; }
		if (rule.minScroll && scrollTop <  rule.minScroll) { return false; }
		if (rule.maxScroll && scrollTop >= rule.maxScroll) { return false; }
		if (rule.minHeight && height <  rule.minHeight) { return false; }
		if (rule.maxHeight && height >= rule.maxHeight) { return false; }
		
		return true;
	}
	
	function update() {
		var l = rules.length;
		var rule;
		
		while (l--) {
			rule = rules[l];
			
			if (rule.state) {
				if (!test(rule)) {
					rule.state = false;
					rule.exit();
					return;
				}
			}
			else {
				if (test(rule)) {
					rule.state = true;
					rule.enter();
					return;
				}
			}
		}
	}
	
	function scroll(e) {
		scrollTop = win.scrollTop();
		update();
	}
	
	function resize(e) {
		width = document.documentElement.clientWidth;
		update();
	}
	
	win
	.on('scroll', scroll)
	.on('resize', resize);
	
	width = document.documentElement.clientWidth;
	scrollTop = win.scrollTop();
	
	window.breakpoint = media;
})(jQuery, window);