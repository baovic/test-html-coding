	$(document).ready(function()
	{
		if(screen.width <= 736){
		}
		else{
			
			// $(function(){
			// 	Cufon.replace('.CorrectScore li, .point, .breakdown span, .submit,  .p1, .p2, .paging, .share a, .s-match li span, .dsubmit label', {fontFamily:'SFNS Display', hover: true});	
			// 	Cufon.replace('h1, .kichOff', {fontFamily:'Myriad Pro', hover: true});	
			// });
		}

		$(".login").click(function() {	
			if($(this).hasClass('active')) {
				$(".formS").slideUp();
				$(this).removeClass('active');
			}else{
				$(".formS").slideDown();
				$(this).addClass('active');
			}	
		});	
		$(".up").click(function() {	
			$(".login").removeClass('active');
			$(".formS").slideUp();
		});
	});
	// $(document).click(function(e) {
	//     if ( $(e.target).closest('.iconMenusp,.menuSp').length === 0 ) {
	//         $('.iconMenusp').removeClass('active');
	// 		$('.menuSp').hide(); 
	//     }
	// });

	// $(document).ready(function(){
	// 	$(".iconMenusp").click(function() {
	// 	if($(this).hasClass('active')) {
	// 		$(".menuSp").hide();
			
	// 		$(this).removeClass('active');
	// 	}else{
			
	// 		$(".menuSp").css('display','inline-block');
	// 		$(this).addClass('active');
	// 	}	
	// });	
	// $(".menuSp li").click(function() {	
	// 	if($(this).hasClass('active')) {
	// 		$(".sub").hide();
	// 		$(this).removeClass('active');
	// 	}else{
	// 		$(".menuSp li").removeClass('active');
	// 		$(".sub").hide();
	// 		$(this).find("ul.sub").show();
	// 		$(this).addClass('active');
	// 	}	
	// });	
	// if(screen.width <= 736){
	// 	$(".linePropertyInformation").remove();   
	// }
			
	//  var topBtn = $('.topPgae');
	//  topBtn.click(function () {
	//         $('body,html').animate({
	//             scrollTop: 0
	//         }, 500);
	//         return false;
	//     });

	//  });    
