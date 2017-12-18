document.addEventListener('deviceready', function() {

    var domElement = document.body;
    angular.bootstrap(domElement, ['app']);
}, false);

interact('.rectangle').resizable({
    // Resize from all edges and corners
    edges: {left: true, right: true, bottom: true, top: true},

    // Keep the edges inside the parent
    restrictEdges: {
        outer: 'parent',
        endOnly: true,
    },

    // Minimum size
    restrictSize: {
        min: { width: 100, height: 50 },
    },
})
.on('resizemove', function(event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
})
