# window.breakpoint


Respond to media and scrolling breakpoints.

    var query = {
        minWidth: '32em',
        maxWidth: 1024,
        minScroll: 0,
        maxScroll: 400
    };
    
    function enter() {
        console.log('ENTER');
    }
    
    function exit() {
        console.log('EXIT');
    }
    
    window.breakpoint(query, enterFn, exitFn)

<code>enterFn</code> is now called whenever the window is resized or scrolled and the conditions in the <code>query</code> become true.
<code>exitFn</code> is called whenever the window is resized or scrolled and the conditions in the <code>query</code> become false.

All properties of the query are optional.


### Dependencies

Currently depends on jQuery, but this is an easy dependency to remove, so will probably do that.
