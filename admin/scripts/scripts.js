(function(){
    var scriptSrc = document.currentScript.src;
    var packagePath = scriptSrc.replace('/scripts/scripts.js', '').trim();
    var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
    var packageId = re.exec(scriptSrc.toLowerCase())[1];
    var hostname = window.location.hostname;
    var adminID = $("#userGuid").val();

    $(document).ready(function(){
        if($("body").hasClass("item-page")){
            // var page_load = setInterval(function(){
            //     if (document.querySelectorAll("#no-more-tables > thead > tr").length){
            //         clearInterval(page_load);
            //         create_new_coumn();
            //     } 
            // }, 500);
            
            // function create_new_coumn(){
            //     var table = document.querySelectorAll("#no-more-tables > thead > tr")[0];
            //     var new_column_head =  document.createElement("th");
        
            //     new_column_head.setAttribute("data-column", "9");
            //     new_column_head.setAttribute("class", "tablesorter-header tablesorter-headerUnSorted");
            //     new_column_head.setAttribute("tab-index", "0");
            //     new_column_head.setAttribute("scope", "col");
            //     new_column_head.setAttribute("role", "columheader");
            //     new_column_head.setAttribute("aria-disabled", "false");
            //     new_column_head.setAttribute("aria-controls", "no-more-tables");
            //     new_column_head.setAttribute("unselectable", "on");
            //     new_column_head.setAttribute("aria-sort", "none");
            //     new_column_head.setAttribute("aria-label", "Verified:  No sort applied, activate to apply an ascending sort");
            //     new_column_head.setAttribute("style", "user-select: none;");
        
            //     var new_column_name = document.createElement("div");
            //     new_column_name.innerHTML = "Verified";
            //     new_column_name.setAttribute("class", "tablesorter-header-inner");
        
            //     new_column_head.appendChild(new_column_name);
            //     table.appendChild(new_column_head);
    
            //     var table_load = setInterval(function(){
            //         if(document.querySelectorAll("#no-more-tables > tbody").length){
            //             clearInterval(table_load);
            //             var table_body = document.querySelectorAll("#no-more-tables > tbody")[0];
            //             $("tr", table_body).each(function(index, key){ 
            //                 var button = document.createElement("div");
            //                 button.innerHTML = "<select name=\"verified_dropdown\" class=\"verified\"> <option value=\"Choose\">Choose</option><option value=\"verified\">Verified</option><option value=\"unverified\">Unverified</option></select>";
            //                 key.appendChild(button);            
            //             });
            //         }
            //     }, 1000);
            // }
        }

        if($("body").hasClass("edititem-page")){
            var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
            var path = window.location.search;
            var itemGuid = re.exec(path)[0];

            check_verified_plugin_switch(itemGuid);
            
        }

        function check_verified_plugin_switch(id){
            var settings = {
                "url": packagePath + "/check_plugin_switch.php",
                "method": "POST",
                "data" : JSON.stringify({"one": "one"}),
                "headers": {
                    "Content-Type": "application/json"
                }
            };

            $.ajax(settings).done(function(response){
                response = JSON.parse(response);
                if(response){
                    create_verified_button(id);
                }
            });

            var verifiied_load = setInterval(function(){
                if(document.querySelectorAll("#Vetting-Verified").length){
                    console.log("exists");
                    $("#Vetting-Verified").change(function(){
                        var choice = $(this).find("option:selected").val();
                        change_item_verified_cf(choice, id);
                    });
                    clearInterval(verifiied_load);
                }
            }, 2000)

            $("#Vetting-Verified").change(function(){
                var choice = $(this).find("option:selected").val();
                change_item_verified_cf(choice, id);
            });
        }

        function create_verified_button(id){
            var container  = document.querySelector(".gutter-wrapper");
            var verified_box = document.createElement("div");
            verified_box.setAttribute("class", "panel-box panel-pad");

            var verified_box_2 = document.createElement("div");
            verified_box_2.setAttribute("class", "item-form-group");

            verified_box.appendChild(verified_box_2);

            var verified_box_3 = document.createElement("div");
            verified_box_3.setAttribute("class", "row");

            verified_box_2.appendChild(verified_box_3);

            var verified_box_4 = document.createElement("div");
            verified_box_4.setAttribute("class", "col-md-6");

            verified_box_3.appendChild(verified_box_4);

            var verified_label = document.createElement("label");
            verified_label.innerHTML = "Verified Status";
            var verified_input = document.createElement("select");
            verified_input.setAttribute("class", "");
            verified_input.setAttribute("id", "Vetting-Verified");
            verified_input.setAttribute("data-custom-field-code", "Vetting-Verified");
            var verified_input_options_1 = document.createElement("option")
            verified_input_options_1.setAttribute("value", "Verified");
            verified_input_options_1.innerHTML = "Verified";

            var verified_input_options_2 = document.createElement("option")
            verified_input_options_2.setAttribute("value", "Unverified");
            verified_input_options_2.innerHTML = "Unverified";

            verified_input.appendChild(verified_input_options_1);
            verified_input.appendChild(verified_input_options_2);

            verified_box_4.appendChild(verified_label);
            verified_box_4.appendChild(verified_input);

            var save_btn = document.querySelector(".gutter-wrapper .btn-center");
            container.insertBefore(verified_box, save_btn);

            var verified_value = initialise(id);
            if(verified_value.verified_cf == "Verified" && verified_value.IsAvailable == true){
                verified_input_options_1.selected = true;
            }
            else if(verified_value.verified_cf == "Unverified" && verified_value.IsAvailable == false){
                verified_input_options_2.selected = true;
            }
        }

        function change_item_verified_cf(choice, item){
            var settings = {
                "url": packagePath + "/toggle_item.php",
                "method": "POST",
                "async": false,
                "data": JSON.stringify({"choice": choice, "itemID": item}),
                "headers": {
                    "Content-Type": "application/json"
                }
            };
            $.ajax(settings).done(function(response){
                response = JSON.parse(response);
                if(response == "success"){
                    toastr.success("Verified status changed", "Success");
                }
                else{
                    toastr.error("Something went wrong", "Error");
                }
            });
        }

        function initialise(id){
            var current_value;
            var settings = {
                "url": packagePath + "/check_item.php",
                "method": "POST",
                "data": JSON.stringify({"id": id}),
                "headers": {
                    "Content-Type": "application/json"
                },
                "async": false
            };
            $.ajax(settings).done(function(response){
                current_value = JSON.parse(response);
                console.log(current_value);
            });
            return current_value;
        }
    })
})();