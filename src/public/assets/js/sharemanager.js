(function (window){
	"use strict"	
	var HAPShareManager = function(settings){

		var isMobile = HAPUtils.isMobile()

		/*fbk = settings.facebookAppId || settings.fbk
			
		if(fbk){
			if(!HAPUtils.isEmpty(fbk)){
				injectFbSdk(fbk);
			}else{
				console.log('Facebook api key has not been set in settings!');
			}
		}*/

		// function injectFbSdk(fs_api_id) {
			
		// 	// this loads the Facebook API
		//     (function (d, s, id) {
		//         var js, fjs = d.getElementsByTagName(s)[0];
		//         if (d.getElementById(id)) { return; }
		//         js = d.createElement(s); js.id = id;
		//         js.src = "//connect.facebook.net/en_US/sdk.js";
		//         fjs.parentNode.insertBefore(js, fjs);
		//     }(document, 'script', 'facebook-jssdk'));

		//     window.fbAsyncInit = function () {
		//         FB.init({
		//             appId: fs_api_id,
		//             xfbml: true,
		//             version: 'v2.9'
		//         });
		//     };

		// }

	};	

	window.HAPShareManager = HAPShareManager;

}(window));
