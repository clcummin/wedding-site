$(function() {
  var $fb = $('#flipbook');
  if (!$fb.length) return;

  var vw      = $(window).width();
  var pageW   = Math.min(vw * 0.9, 800);
  var pageH   = pageW * 0.66;
  var spreadW = pageW * 2;

  $fb.turn({
    width:      spreadW,
    height:     pageH,
    display:    'double',
    autoCenter: true,
    acceleration:false,
    gradients:  false,
    elevation:  0,
    duration: 0
  });
  $fb.turn('page',2);
  $fb.removeClass('preload');
  // bind our new controls
  $('#prevBtn').on('click', function(e) {
    e.preventDefault();
    $fb.turn('previous');
  });
  $('#nextBtn').on('click', function(e) {
    e.preventDefault();
    $fb.turn('next');
  });
});
