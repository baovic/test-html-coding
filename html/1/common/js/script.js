	
	$(document).click(function(e) {
	    if ( $(e.target).closest('.iconMenusp,.menuSp').length === 0 ) {
	        $('.iconMenusp').removeClass('active');
			$('.menuSp').hide(); 
	    }
	});

	$(document).ready(function(){
		$(".iconMenusp").click(function() {
		if($(this).hasClass('active')) {
			$(".menuSp").hide();
			
			$(this).removeClass('active');
		}else{
			
			$(".menuSp").css('display','inline-block');
			$(this).addClass('active');
		}	
	});	
	$(".menuSp li").click(function() {	
		if($(this).hasClass('active')) {
			$(".sub").hide();
			$(this).removeClass('active');
		}else{
			$(".menuSp li").removeClass('active');
			$(".sub").hide();
			$(this).find("ul.sub").show();
			$(this).addClass('active');
		}	
	});	
	if(screen.width <= 736){
		$(".linePropertyInformation").remove();   
	}
		

	 	
	 var topBtn = $('.topPgae');
	 topBtn.click(function () {
	        $('body,html').animate({
	            scrollTop: 0
	        }, 500);
	        return false;
	    });

	 });    
