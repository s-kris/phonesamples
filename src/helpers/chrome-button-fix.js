document.addEventListener( 'click', function( e ) {
  if ( document.activeElement.toString() === '[object HTMLButtonElement]' ) {
    document.activeElement.blur();
  }
} );
