//Preload
	// makes sure the whole site is loaded
	$(window).load(function() {	        
	        // will fade out the whole DIV that covers the website.
		$("#preloader").delay(50).fadeOut("slow");
	})
	$(window).on('load',function() {
	$("#hero").css("height", window.innerHeight+"px");
	$('.ripple').materialripple();
	});
	// new Script 
	$('a[href*=#]').on('click', function(event){     
    event.preventDefault();
    $('html,body').animate({scrollTop:$(this.hash).offset().top}, 1200, 'swing');
	});