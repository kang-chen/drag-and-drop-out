const mainModule = (function () {

    const state = {
        selectedBoxId: null,
        dragged: null,
        x: null,
        y: null
    }

    let containerClass = null;
    let boxClass = null;
    let containerContainerId = null;
    let boxContainerId = null;

    const DnD = function(c, b, cc = 'container-drop', bc = 'container-box') {    
        containerClass = c;
        boxClass = b;
        containerContainerId = cc;
        boxContainerId = bc;
    };

    const addMultipleEventListeners = function(element, eventsMap) {
    Object.keys(eventsMap).forEach(function(key) {
        element.addEventListener(key, eventsMap[key]);
    })
    }

    const setState = function(newState) {
        state = {state, ...newState};
    }

    const handleClick = function(event) {
        randomOtherFunction();
        state.selectedBoxId = event.target.id;
    }
    
    const handleDragStart = function( event ) {
        state.dragged = event.target;
        event.target.style.opacity = .5;
    };

    const handleDragEnd = function( event ) {
        // reset the transparency
        state.dragged = null;
        event.target.style.opacity = "";
    };
    
    const draggableEventsMap = {
        'click': handleClick,
        'dragstart': handleDragStart,
        'dragend': handleDragEnd
    }

    var generateId = function() {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    DnD.prototype.init = function() {
        const containers = document.getElementsByClassName(containerClass);    
        const boxes = document.getElementsByClassName(boxClass);

        for(const box of boxes) {
            addMultipleEventListeners(box, draggableEventsMap);
            
            box.addEventListener("drop", function( event ) {
                event.stopImmediatePropagation();
                event.preventDefault();
                event.target.classList.remove('dragenter');
            });
        }
    
        for(const container of containers) {

            container.addEventListener("dragover", function( event ) {
                // prevent default to allow drop
                event.preventDefault();
            });

            container.addEventListener("dragenter", function( event ) {
                event.target.classList.add('dragenter');
            });

            container.addEventListener("dragleave", function( event ) {
                event.target.classList.remove('dragenter');
                if(Array.from(event.target.classList).includes('box')) {
                    event.preventDefault();
                    event.target.parentNode.removeChild(state.dragged);
                    document.getElementById(boxContainerId).appendChild(state.dragged); 
                } else {
                    event.preventDefault();
                    
                }
            });

            container.addEventListener("drop", function( event ) {
                // event delegation
                console.log('this state dragged id', state.dragged.id);
                if(Array.from(event.target.classList).includes('box')) {
                    event.preventDefault();
                } else {
                event.preventDefault();
                // move dragged elem to the selected drop target
                event.target.classList.remove('dragenter');
                const containerDataKey = event.target.getAttribute('data-pairing-key');
                const boxDataKey = state.dragged.getAttribute('data-pairing-key');

                    if ( containerDataKey === boxDataKey) {
                        state.dragged.parentNode.removeChild(state.dragged);
                        event.target.appendChild(state.dragged);
                    }
                }
            });

            //if dragged outside of the drop zone then do something else

        }
    }

    DnD.prototype.clean = function() {
        console.log('clean');
    }

    return DnD;
    
})();

export default mainModule