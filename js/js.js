$(function(){	
	$('.indexBg').css('width',$(document).width()).css('height',$(document).height());
	$('.content .leftNav').css('min-height',$(window).height()-60);
	$('.leftNavSz').css('min-height',$(window).height()-45);
	$('.content .bodyRight').css('min-height',$(window).height()-60);
	$('.content .bodyRight iframe').css('min-height',$(window).height()-60);
	$('.content .bodyRight').css('min-width',$(window).width()-245);
	
	$('.szxmTjPageRight').css('min-width',$(window).width()-321);
	$('.szxmTjPageRight').css('min-height',$(window).height()-45);
	$('.szxmTjPageRight iframe').css('min-height',$(window).height()-45);
	
	

	
	
	$('.content .leftNav div h2').click(function(){
		//$(this).siblings('ul').slideToggle();	
		$('.content .leftNav div ul').slideUp();	
		$('.information h2 span,.integrated h2 span,.system h2 span').css('background-image','url(img/leftNavLeft.png)')	
		if($(this).siblings('ul').is(':hidden')){
			$(this).siblings('ul').slideDown();
			$(this).find('span').css('background-image','url(img/leftNavBottom.png)')
		}else{
			$(this).siblings('ul').slideUp();
		}
		
	});
	
	$('.leftNavSz div h2').click(function(){
		//$(this).siblings('ul').slideToggle();	
		$('.leftNavSz div ul').slideUp();	
		$('.leftNavSz div h2 span').css('background-image','url(img/leftNavLeft.png)')	
		if($(this).siblings('ul').is(':hidden')){
			$(this).siblings('ul').slideDown();
			$(this).find('span').css('background-image','url(img/leftNavBottom.png)')
		}else{
			$(this).siblings('ul').slideUp();
		}
		
	});
	
	
	
	$(window).resize(function(){
		$('.content .bodyRight').css('min-width',$(window).width()-245);
		$('.content .bodyRight').css('height',$(window).height()-60);
		$('.content .leftNav').css('min-height',$(window).height()-60);
		if($('.content .bodyRight').css('width')<1108){
			$('.content .bodyRight').css('width',1108);
		}
		if($('body').height()>$(window).height()){
			$('.content .leftNav').css('min-height',$('body').height()-60);			
		}
	});
	
	$('.content .bodyRight .leftNavHide').click(function(){	
		$('.content .leftNav').toggle();
		if($('.content .leftNav').is(":hidden")){
			$('.content .bodyRight .leftNavHide').css('background-image','url(img/leftNavShow.png)')
			$('.content .bodyRight').css('width',$(window).width());
			}else{
				$('.content .bodyRight .leftNavHide').css('background-image','url(img/leftNavHide.png)')
				$('.content .bodyRight').css('width',$(window).width()-221);
				}
			});
			
	$('.tzgg .tzggSerach .tzggSerachType .tzggSerachTypeSelect h2').click(function(){
		$('.tzgg .tzggSerach .tzggSerachType .tzggSerachTypeSelect ul').toggle();		
	});
	$('.tzgg .tzggSerach .tzggSerachType .tzggSerachTypeSelect ul li').click(function(){
		$('.tzgg .tzggSerach .tzggSerachType .tzggSerachTypeSelect ul').hide();				
	});
	$('.xxtz .xxtzTabList li').click(function(){
		$(this).addClass('xxtzTabSelect').siblings('li').removeClass('xxtzTabSelect');
		$('.xxtz .xxtzTab').eq($(this).index()).show().siblings('.xxtzTab').hide();
	});
	$('.xxtz .xxtzTab .xzxx div span').click(function(){
		$('.xxtz .xxtzTab .xzxx ul').toggle();
	});
	
	$('.xmbb .xmbbTabList li').click(function(){
		$(this).addClass('xmbbTabSelect').siblings('li').removeClass('xmbbTabSelect');
		$('.xmbb .xmbbTab').eq($(this).index()).show().siblings('.xmbbTab').hide();
	});
	
	
	
	
	
	
	
	
	});