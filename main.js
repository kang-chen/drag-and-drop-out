const testModule = (function () {
 
  const containers = document.getElementsByClassName('holder');    
  const boxes = document.getElementsByClassName('box');

  const state = {
    selectedBoxId: null,
    dragged: null,
    x: null,
    y: null
  }

  const addMultipleEventListeners = function(element, eventsMap) {
    Object.keys(eventsMap).forEach(function(key) {
      element.addEventListener(key, eventsMap[key]);
    })
  }

  const setState = function(newState) {
    state = {state, ...newState};
  }

  const randomOtherFunction = function(event) {
      // console.log('event', event);
      const firstOne = 1;
      const secondOne = 1;
      return firstOne+secondOne;
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

  const dragContainerEventsMap = {

  }
  
  var generateId = function() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  }


  return {
    init: function () {
      console.log('init');
      
      function addBoxEventLiseners() {
        for(const box of boxes) {
            addMultipleEventListeners(box, draggableEventsMap);
            
            box.addEventListener("drop", function( event ) {
                event.stopImmediatePropagation();
                event.preventDefault();
                event.target.classList.remove('dragenter');
            });
          }
      }

      addBoxEventLiseners();

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
      }
    },
 
    clean: function () {
      //remove event listeners
    }
  };
 
})();

testModule.init()