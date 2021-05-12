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
        var m_email;
        var m_name;
        var admin_email = getadminemail();
        

        var pathname = (window.location.pathname + window.location.search).toLowerCase();
        var edit = "/user/item/edit";
        var list = "/user/item/list";
        if(pathname.indexOf(edit) > -1){
            var itemID = $("#itemGuid").val();
            $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                if (options.type.toLowerCase() === "post" && options.url.toLowerCase().indexOf('/user/item/updateitems') >= 0) {
                    let success = options.success;
                    
                    options.success = function(data, textStatus, jqXHR) {
                        
                            let itemId = itemID;
                            state = saveItem(itemId);
                        
                        if (typeof(success) === "function" && state) return success(data, textStatus, jqXHR);
                    };
                }
            });
        }

        if(pathname.indexOf(list) > -1){
            getMerchantDetails(merchantID);
            
            var settings = {
                "url": "/api/v2/plugins/"+packageId+"/custom-tables/edit_cache/",
                "method": "GET"
            };
              
            $.ajax(settings).done(function (response) {
                var item_list = response.Records;
                item_list.forEach(element => {
                    if(element.status == 0 && element.merchant == merchantID){
                        var sync_item_id = element.item;
                        var row_id = element.Id;
                        var item_name = element.name;
                        action(sync_item_id, row_id, item_name);
                    }
                });
            });
        }

        function saveItem(id){
            var status = false;
            var itemName;
            var settings = {
                "url": "/api/v2/merchants/"+merchantID+"/items/"+id,
                "method": "PUT",
                "async": false,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                "data": JSON.stringify({"IsAvailable": false, "IsVisibleToCustomer": false}),
                success: function(response){
                    status = true;
                    itemName = response.Name;
                    // console.log(item_name);
                }
            };
                
            $.ajax(settings);

            var cache_settings = {
                "url": "/api/v2/plugins/"+packageId+"/custom-tables/edit_cache/rows",
                "method": "POST",
                "async": false,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({"item":id, "status": 0, "name": itemName, "merchant": merchantID}),
            };

            $.ajax(cache_settings);

            return status;
        }

        function action(item, row, name) {
            update_cache_entry(row, name);
        }

        function update_cache_entry(row, i_name){
            var data = {
                "status": 1
            };
            var settings = {
                "url": "/api/v2/plugins/"+packageId+"/custom-tables/edit_cache/rows/"+row,
                "method": "PUT",
                "headers": {
                  "Content-Type": "application/json"
                },
                "data": JSON.stringify(data),
                success: function(){
                    toastr.success("Item submitted for approval", "Success");
                    // console.log(i_name)
                    sendEmailToAdmin(m_email, m_name, admin_email, i_name);
                }
            };
            $.ajax(settings);
        }

        function getCookie(name){
            var value = '; ' + document.cookie;
            var parts = value.split('; ' + name + '=');
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
        }

        function sendEmailToAdmin(merchantemail, merchantname, adminemail, item_name){
            // console.log(item_name)
            var settings = {
                "url": packagePath + "/sendemail.php",
                "method": "POST",
                "async": false,
                "data": JSON.stringify({"merchantemail": merchantemail, "merchantname":merchantname, "adminemail": adminemail, "name": item_name})
            };
            $.ajax(settings);
        }

        function getMerchantDetails(id){
            var settings = {
                "url": "/api/v2/users/"+id,
                "method": "GET",
                "async": false
            };
            
            $.ajax(settings).done(function (response) {
                m_email = response.Email;
                m_name = response.DisplayName;
            });
        }

        function getadminemail(){
            
            var returnvariable ;
            var settings = {
                "url": "/api/v2/marketplaces",
                "method": "GET",
                "timeout": 0,
                "async":false
              };
              
              $.ajax(settings).done(function (response) {
                returnvariable = response.Owner.Email;
              });
              return returnvariable;
        }
    });
})();
