/**
 * Converts the target object to an array.
 */
function toArray(target) {
  return Array.prototype.slice.call(target);
}

/**
 * Sorts and formats all of fragments in the
 * presentation.
 */
function sortAllFragments() {

  var slides = toArray(document.querySelectorAll('section'));
  slides.forEach(function(slide) {
    sortFragments(slide.querySelectorAll('.fragment'));
  });

}

/**
 * Return a sorted fragments list, ordered by an increasing
 * "data-fragment-index" attribute.
 *
 * Fragments will be revealed in the order that they are returned by
 * this function, so you can use the index attributes to control the
 * order of fragment appearance.
 *
 * To maintain a sensible default fragment order, fragments are presumed
 * to be passed in document order. This function adds a "fragment-index"
 * attribute to each node if such an attribute is not already present,
 * and sets that attribute to an integer value which is the position of
 * the fragment within the fragments list.
 */
function sortFragments(fragments) {

  fragments = toArray(fragments);

  var ordered = [],
    unordered = [],
    sorted = [];

  // Group ordered and unordered elements
  fragments.forEach(function(fragment, i) {
    if(fragment.hasAttribute('data-fragment-index')) {
      var index = parseInt(fragment.getAttribute('data-fragment-index'), 10);

      if(!ordered[index]) {
        ordered[index] = [];
      }

      ordered[index].push(fragment);
    }
    else {
      unordered.push([fragment]);
    }
  });

  // Append fragments without explicit indices in their
  // DOM order
  ordered = ordered.concat(unordered);

  // Manually count the index up per group to ensure there
  // are no gaps
  var index = 0;

  // Push all fragments in their sorted order to an array,
  // this flattens the groups
  ordered.forEach(function(group) {
    group.forEach(function(fragment) {
      sorted.push(fragment);
      fragment.setAttribute('data-fragment-index', index);
    });
    index ++;
  });

  return sorted;

}

/**
 * Navigate to the specified slide fragment.
 *
 * @param {Number} index The index of the fragment that
 * should be shown, -1 means all are invisible
 * @param {Number} offset Integer offset to apply to the
 * fragment index
 *
 * @return {Boolean} true if a change was made in any
 * fragments visibility as part of this call
 */
function navigateFragment( index, offset ) {

  var currentSlide = Dz.getCurrentSlide();

  if( currentSlide) {

    var fragments = sortFragments( currentSlide.querySelectorAll( '.fragment' ) );
    if( fragments.length ) {

      // If no index is specified, find the current
      if( typeof index !== 'number' ) {
        var lastVisibleFragment = sortFragments( currentSlide.querySelectorAll( '.fragment.visible' ) ).pop();

        if( lastVisibleFragment ) {
          index = parseInt( lastVisibleFragment.getAttribute( 'data-fragment-index' ) || 0, 10 );
        }
        else {
          index = -1;
        }
      }

      // If an offset is specified, apply it to the index
      if( typeof offset === 'number' ) {
        index += offset;
      }

      var fragmentsShown = [],
        fragmentsHidden = [];

      toArray( fragments ).forEach( function( fragment, i ) {

        if( fragment.hasAttribute( 'data-fragment-index' ) ) {
          i = parseInt( fragment.getAttribute( 'data-fragment-index' ), 10 );
        }

        // Visible fragments
        if( i <= index ) {
          if( !fragment.classList.contains( 'visible' ) ) fragmentsShown.push( fragment );
          fragment.classList.add( 'visible' );
          fragment.classList.remove( 'current-fragment' );

          // Announce the fragments one by one to the Screen Reader
          //dom.statusDiv.textContent = element.textContent;

          if( i === index ) {
            fragment.classList.add( 'current-fragment' );
          }
        }
        // Hidden fragments
        else {
          if( fragment.classList.contains( 'visible' ) ) fragmentsHidden.push( fragment );
          fragment.classList.remove( 'visible' );
          fragment.classList.remove( 'current-fragment' );
        }


      } );

      if( fragmentsHidden.length ) {
        //dispatchEvent( 'fragmenthidden', { fragment: fragmentsHidden[0], fragments: fragmentsHidden } );
      }

      if( fragmentsShown.length ) {
        //dispatchEvent( 'fragmentshown', { fragment: fragmentsShown[0], fragments: fragmentsShown } );
      }

      return !!( fragmentsShown.length || fragmentsHidden.length );

    }

  }

  return false;

}

/**
 * Navigate to the next slide fragment.
 *
 * @return {Boolean} true if there was a next fragment,
 * false otherwise
 */
function nextFragment() {

  return navigateFragment( null, 1 );

}

/**
 * Navigate to the previous slide fragment.
 *
 * @return {Boolean} true if there was a previous fragment,
 * false otherwise
 */
function previousFragment() {

  return navigateFragment( null, -1 );

}

sortAllFragments();
