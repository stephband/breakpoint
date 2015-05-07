# window.breakpoint


Respond to media and scrolling breakpoints.

    var query = {
        minWidth: '32em',
        maxWidth: 1024,
        minScrollTop: 0,
        maxScrollTop: 400
    };

    function enterFn() {
        console.log('ENTER');
    }

    function exitFn() {
        console.log('EXIT');
    }

    window.breakpoint(query, enterFn, exitFn);

<code>enterFn</code> is now called whenever the window is resized or scrolled and the conditions in the <code>query</code> become true.
<code>exitFn</code> is called whenever the window is resized or scrolled and the conditions in the <code>query</code> become false.

All properties of the query are optional:

    minWidth
    maxWidth
    minHeight
    maxHeight
    minScrollTop
    maxScrollTop
    minScrollBottom
    maxScrollBottom


### Dependencies

Currently depends on jQuery, but this is an easy dependency to remove, so will probably do that.
