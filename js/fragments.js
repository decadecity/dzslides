/*global Dz:false */

/**
 * Sorts and formats all of fragments in the
 * presentation.
 */
Dz.sortAllFragments = function() {

  var slides = Dz.slides;
  var total_fragments = 0;
  slides.each(function() {
    var fragments = Dz.sortFragments($(this).find('.fragment'));
    var last_fragment = fragments[fragments.length - 1];
    var last_index = 0;
    if (typeof last_fragment !== 'undefined') {
      // Here be off by one error.
      last_index = last_fragment.data('fragment-index') + 1;
    }
    $(this).data('dc-fragments', last_index);
    total_fragments += last_index;
  });
  $('.slides').data('dc-fragments-all', total_fragments);
};

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
Dz.sortFragments = function(fragments) {

  var ordered = [],
      unordered = [],
      sorted = [];

  // Group ordered and unordered elements
  fragments.each(function() {
    var fragment = $(this);
    if(typeof fragment.data('fragment-index') !== 'undefined') {
      var index = parseInt(fragment.data('fragment-index'), 10);

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
      fragment.data('fragment-index', index);
    });
    index += 1;
  });

  return sorted;

};

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
Dz.navigateFragment = function(index, offset) {
  index = parseInt(index, 10);
  if (isNaN(index)) {
    index = null;
  }

  var current_slide = Dz.getCurrentSlide();

  if(current_slide.length) {

    var fragments = Dz.sortFragments(current_slide.find('.fragment'));
    if(fragments.length) {

      // If no index is specified, find the current
      if(typeof index !== 'number') {
        var last_visisble_fragment = sortFragments(current_slide.find('.fragment.visible')).pop();
        if(last_visisble_fragment) {
          index = parseInt(last_visisble_fragment.data('fragment-index') || 0, 10 );
        }
        else {
          index = -1;
        }
      }

      // If an offset is specified, apply it to the index
      if(typeof offset === 'number') {
        index += offset;
      }

      var fragments_shown = [],
          fragments_hidden = [];

      fragments.forEach(function(fragment, i) {
        fragment = $(fragment);

        if(typeof fragment.data('fragment-index') !== 'undefined') {
          i = parseInt(fragment.data('fragment-index'), 10);
        }

        // Visible fragments
        if (i <= index) {
          if (!fragment.hasClass('visible')) {
            fragments_shown.push(fragment);
          }
          fragment.addClass('visible');
          fragment.removeClass('current-fragment');

          if (i === index) {
            fragment.addClass('current-fragment');
          }
        }
        // Hidden fragments
        else {
          if (fragment.hasClass('visible')) {
            fragments_hidden.push(fragment);
          }
          fragment.removeClass('visible');
          fragment.removeClass('current-fragment');
        }


      } );

      if (fragments_hidden.length) {
        Dz.sendEvent('FRAGMENT_HIDDEN', {
          fragment: fragments_hidden[0],
          fragments: fragments_hidden
        });
      }

      if (fragments_shown.length) {
        Dz.sendEvent('FRAGMENT_SHOWN', {
         fragment: fragments_shown[0],
         fragments: fragments_shown
       });
      }

      return !!(fragments_shown.length || fragments_hidden.length);

    }

  }

  return false;

};


