(function(){
    var scriptSrc = document.currentScript.src;
    var packagePath = scriptSrc.replace('/scripts/scripts.js', '').trim();
    var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
    var packageId = re.exec(scriptSrc.toLowerCase())[1];

    $(document).ready(function(){
        var baseUrl = window.location.hostname;
        var token = getCookie('webapitoken');
        var merchantID = $("#userGuid").val();
        var state = false;
        var pathname = (window.location.pathname + window.location.search).toLowerCase();
        var edit = "/user/item/edit";
        var list = "/user/item/list";

        if($("body").hasClass("seller-upload-page") || $("body").hasClass("item-upload")){
            var flag = get_ver("create");
            a();
            $(".item-upload-category-container").click(function(){
                a();
            });
            $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                if (options.type.toLowerCase() === "post" && options.url.toLowerCase().indexOf('/user/item/createitems') >= 0) {
                    console.log(options.url);
                    if(flag == "false"){
                        console.log("getver(\"create\") value: " + flag);
                        let success = options.success;
                    
                        options.success = function(data, textStatus, jqXHR) {
                            if (data.Success) {
                                console.log(data);
                                let itemId = data.Guid;
                                state = saveItem(itemId, merchantID);
                            }
                            if (typeof(success) === "function" && state) return success(data, textStatus, jqXHR);
                        };
                    }
                }
            });
        }

        if(pathname.indexOf(edit) > -1){
            var flag = get_ver("edit");
            console.log("get_ver(\"edit\") value: " + flag);
            a();
            $(".item-upload-category-container").click(function(){
                a();
            });
            var itemID = $("#itemGuid").val();
            $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                if(flag == "false"){
                    if (options.type.toLowerCase() === "post" && options.url.toLowerCase().indexOf('/user/item/updateitems') >= 0) {
                        console.log(options.url);
                        let success = options.success;
                        options.success = function(data, textStatus, jqXHR) {
                                console.log(data);
                                let itemId = itemID;
                                state = save_edited_Item(itemId);
                            
                            if (typeof(success) === "function" && state) return success(data, textStatus, jqXHR);
                        };
                    }
                }
            });
        }

        function save_edited_Item(id){
            var status = false;
            var settings = {
                "url": "/api/v2/merchants/"+merchantID+"/items/"+id,
                "method": "PUT",
                "async": false,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                "data": JSON.stringify({"IsAvailable": false, "IsVisibleToCustomer": false, "CustomFields": [{ "Code": "Vetting-Verified", "Values": ["Unverified"]}]}),
                success: function(response){
                    status = true;
                }
            };
                
            $.ajax(settings);
            return status;
        }


        function saveItem(id, merchant){
            var status = false;
            var settings = {
                "url": "/api/v2/merchants/"+merchant+"/items/"+id,
                "method": "PUT",
                "async": false,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                "data": JSON.stringify({"IsAvailable": false, "IsVisibleToCustomer": false, "CustomFields": [{ "Code": "Vetting-Verified", "Values": ["Unverified"]}]}),
                success: function(response){
                    status = true;
                }
            };
                
            $.ajax(settings);
            return status;
        }

        function get_ver(event){
            var state;
            var settings = {
                "url": packagePath + "/ver.php",
                "method": "POST",
                "async": false,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({"event": event})
            };
            $.ajax(settings).done(function(response){
                state = response;
            });
            return state;
        }

        function getCookie(name){
            var value = '; ' + document.cookie;
            var parts = value.split('; ' + name + '=');
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
        }

        function a(){
            var inte = setInterval(function(){
                var cfs = document.querySelectorAll("#customFields > div");
                if(cfs.length){
                    cfs = $("#customFields > div");
                    for(i=0;i<cfs.length;i++){
                        for(ii=0;ii<2;ii++){
                            if(cfs[i].childNodes[ii].innerHTML == "Vetting-Verified*"){
                                console.log(cfs[i].childNodes[ii])
                                cfs[i].removeChild(cfs[i].childNodes[0]);
                                cfs[i].removeChild(cfs[i].childNodes[0]);
                                clearInterval(inte);
                            }
                        }
                    }
                    clearInterval(inte);
                }
            }, 500);
        }
    });
})();