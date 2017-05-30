var elements = 
function(wrapper){
  
  var activeElements = [];
  var container = (wrapper || document.body);
  var FOCUSABLE = ['A','INPUT','SELECT','TEXT','TEXTAREA','BUTTON','IFRAME'];
  var FOCUSABLESTRING = "a[href]:visible, area[href]:visible, input:not([disabled]):visible, select:not([disabled]):visible, textarea:not([disabled]):visible, button:not([disabled]):visible, iframe:visible, object:visible, embed:visible, *[tabindex]:visible, *[contenteditable]:visible";
  var trapped;
  /*
   * Creates special container outside of wrapper, if not provided outisde of body.
   * This is not semantically correct, but it forces screen reader to lock only in the active element.
   */
  var _inside = 
  function(){
    var inside =
    document.querySelector('#inside');
    if(!inside){
      inside = document.createElement('div')
      inside.setAttribute('id','inside');
      container.parentElement.appendChild(inside);
    }
    return inside;
  };
  
  /*
   * Add new element to the queue of active elements.
   */
  var _add = 
  function(element){
    activeElements.push(element);
  };
  
  /*
   * Retrieves next element queued to be displayed.
   */
  var _next = 
  function(){
    var element = activeElements.pop(element);
    _focusTo(element);
    _trapIn(element);
  };
  
  /* Find first focusable element in the container
   * If nothing exist it creates an anchor.
   * @element = HTMLNode 
   */
  var _focusTo = 
  function(element){
    var tagName = element.tagName.toUpperCase();
    var attach = ( FOCUSABLE.indexOf(tagName) === -1 ) ? null: element;
    
    if (!attach){ // If our element is not focusable. 
        attach = 
        element.querySelectorAll(FOCUSABLESTRING); // look for a focusable children.
        attach = attach.length > 0 ? attach.length[0] : 
        (function(){ var anchor = document.createElement('a'); // or create an invisible focus element.
                         anchor.setAttribute('href','#'); 
                         return anchor; }());
    }

    attach.focus();
  };

  var _trapped = 
  function(element){
    element.querySelector(FOCUSABLESTRING);
    return function(ev){
        if(ev.target.parentNode !== element){
            ev.target.focus(); 
        } 
    };
  };
  
  /* Trap tab navigation into an element container.
   * @element Node To trap in container. 
   */
  var _trapIn = 
  function(element){
    if (element.hasChildNodes()) return -1;
    trapped = _trapped(element);
    document.addEventListener('focusin',trapped,true);
  };
  
  /* Release tab navigation of an element container.
   * @element Node To trap in container. 
   */
  var _trapOut =
  function(){
    document.removeEventListener('focusin',trapped,false);
    trapped = null;
  };
  
  /*
   * Hides previous visible element.
   * Hides body for screen reader.
   * Show new visible element
  */
  var _activeElement = 
  function(el){
    var inside = _inside();
    
    container
    .setAttribute("aria-hidden","true");
    
    inside
    .setAttribute("aria-hidden","false");
    
    inside
    .appendChild(el);
    
    return;
  }
  
  return {
    add: _add,
    next: _next,
    focus: _focusTo,
    trapIn: _trapIn,
    trapOut: _tropOut
  };
  
};


