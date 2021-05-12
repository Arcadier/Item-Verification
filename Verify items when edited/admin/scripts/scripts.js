(function(){
    var scriptSrc = document.currentScript.src;
    var packagePath = scriptSrc.replace('/scripts/scripts.js', '').trim();
    var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
    var packageId = re.exec(scriptSrc.toLowerCase())[1];
    
    $(document).ready(function(){
        var baseUrl = window.location.hostname;
        var token = getCookie('webapitoken');
        var adminID = $("#userGuid").val();
        var adminemail;
        var merchantemail;
        var merchantname;
        
        if($("body").hasClass("item-page")){
            var settings = {
                "url": "/api/v2/users/"+adminID,
                "method": "GET"
            };
            
            $.ajax(settings).done(function (response) {
                adminemail = response.Email;     
            });

            $('body').on('click', '.onoffswitch-label', function(){
                var x = $(this).closest("tr.item-row").attr('data-guid');
                var merchantID;
                var avail;
                // console.log(x);

                toastr.info("Please wait", "Updating merchant");
                var timer = setInterval(function(){
                    var settings = {
                        "url": "/api/v2/items/"+x,
                        "method": "GET",
                        "async": false
                    };
                    
                    $.ajax(settings).done(function (response) {
                        merchantID = response.MerchantDetail.ID;
                        avail = response.IsVisibleToCustomer;
                        merchantemail = response.MerchantDetail.Email;
                        merchantname = response.MerchantDetail.DisplayName;
                        // console.log(merchantemail);
                    });
    
                    var settings = {
                        "url": "/api/v2/merchants/"+merchantID+"/items/"+x,
                        "method": "PUT",
                        "async": false,
                        "headers": {
                          "Content-Type": "application/json",
                          "Authorization": "Bearer " + token
                        },
                        "data": JSON.stringify({"IsAvailable": avail}),
                    };
                      
                    $.ajax(settings).done(function (response) {
                        toastr.success("Merchant portal updated", "Success");
                        itemname = response.Name;
                        // console.log(itemname);
                        if(avail == true){
                            var settings = {
                                "url": "/api/v2/admins/"+adminID+"/emails",
                                "method": "POST",
                                "timeout": 0,
                                "headers": {
                                  "Content-Type": "application/json",
                                  "Authorization": "Bearer "+token
                                },
                                "data": JSON.stringify({"From":adminemail,"To":merchantemail,"Body":"Your item "+itemname+" has been approved.", "Subject":"Your Item "+itemname+" has been approved."})
                            }
                            $.ajax(settings).done(function (response) {
                                toastr.success("Email has been sent to the merchant","Success");
                            });
                        }
                        if(avail == false){
                            console.log("Item disabled");
                        }
                        clearInterval(timer);
                    });
                }, 2000);
            });
        }
        function getCookie(name){
            var value = '; ' + document.cookie;
            var parts = value.split('; ' + name + '=');
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
        }
    });
})();
