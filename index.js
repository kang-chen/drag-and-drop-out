const dndModule = (function () {

    const state = {
        selectedBoxId: null,
        dragged: null,
        x: null,
        y: null,
        pairingEnabled: false
    }

    let containerClass = null;
    let boxContainer = null;

    const addMultipleEventListeners = function(element, eventsMap) {
        Object.keys(eventsMap).forEach(function(key) {
            element.addEventListener(key, eventsMap[key]);
        })
    }

    const handleClick = function(event) {
        state.selectedBoxId = event.target.id;
    }
    
    const handleDragStart = function( event ) {
        state.dragged = event.target;
        event.target.style.opacity = .5;
    };

    const handleDragEnd = function( event ) {
        // reset the transparency
        event.target.style.opacity = "";
        state.dragged = null;
    };

    const handleDragOver = function( event ) {
        // prevent default to allow drop
        event.preventDefault();
    };
    
    const handleDragEnter = function( event ) {
        event.target.classList.add('dragenter');
    }

    const handleDragLeave = function( event ) {
        event.target.classList.remove('dragenter');
        if(Array.from(event.target.classList).includes('box')) {
            event.preventDefault();
            event.target.parentNode.removeChild(state.dragged);
            boxContainer.appendChild(state.dragged);
        } else {
            event.preventDefault();
        }
    }

    const handleContainerDrop = function( event ) {
        if(Array.from(event.target.classList).includes('box')) {
            event.preventDefault();
        } else {
            event.preventDefault();
            // move dragged elem to the selected drop target
            event.target.classList.remove('dragenter');
            const containerDataKey = event.target.getAttribute('data-pairing-key');
            const boxDataKey = state.dragged.getAttribute('data-pairing-key');
            
            if (state.pairingEnabled ) {
                if (containerDataKey === boxDataKey) {
                    state.dragged.parentNode.removeChild(state.dragged);
                    // const draggedRect = state.dragged.getBoundingClientRect();
                    // state.dragged.style.position = 'absolute';
                    // state.dragged.style.left = draggedRect.y;
                    // state.dragged.style.top = draggedRect.x;
                    event.target.appendChild(state.dragged);
                }
            }
            else {
                state.dragged.parentNode.removeChild(state.dragged);
                event.target.appendChild(state.dragged);
            }
        }
    }

    const handleBoxDrop = function( event ) {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.target.classList.remove('dragenter');
    }

    const draggableEventsMap = {
        'click': handleClick,
        'dragstart': handleDragStart,
        'dragend': handleDragEnd,
        'drop': handleBoxDrop
    }   

    const containerEventsMap = {
        'dragover': handleDragOver,
        'dragenter': handleDragEnter,
        'dragleave': handleDragLeave,
        'drop': handleContainerDrop
    }

    const DnD = function(c='drop-zone') {    
        containerClass = c;
    };
    
    DnD.prototype.init = function() {
        const containers = document.getElementsByClassName(containerClass);    
        const boxes = document.querySelectorAll('[draggable]');
        boxContainer = boxes[0].parentNode;

        if (document.querySelectorAll('[data-pairing-key]').length > 1) {
            state.pairingEnabled = true;
        }
        
        for(const box of boxes) {
            addMultipleEventListeners(box, draggableEventsMap);
        }

        for(const container of containers) {
            addMultipleEventListeners(container, containerEventsMap);
        }
    }

    DnD.prototype.clean = function() {
        
    }

    return DnD;
    
})();


export default dndModule