(function(){
    var scriptSrc = document.currentScript.src;
    var packagePath = scriptSrc.replace('/scripts/scripts.js', '').trim();
    var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
    var packageId = re.exec(scriptSrc.toLowerCase())[1];

    var plugin_enabled = document.getElementById('myonoffswitch');
    var new_items_verified = $("#new_items_verified");
    var new_items_unverified = $("#new_items_unverified");
    var edited_items_verified = $("#edited_items_verified");
    var edited_items_unverified = $("#edited_items_unverified");
    var unverified_items;

    //run on page load
    init();

    //enable plugin toggle
    $("#myonoffswitch").click(function(){
        var values = document.getElementById("myonoffswitch");
        if(values.checked){ 
            toggle_plugin(true);
        }
        else{ 
            toggle_plugin(false);
        }
    });

    new_items_verified.click(function(){
        var settings_1 = {
            "url": "/admin/plugins/"+packageId+"/item_settings.php",
            "method": "POST",
            "data": JSON.stringify({ "new_items_verified": "true", "edited_items_verified": null }),
            "async": false,
            "headers":{
              "Content-Type":"application/json"
            }
        };
        $.ajax(settings_1).done(function(response){
            console.log(JSON.parse(response));
        })
    });

    new_items_unverified.click(function(){
        var settings_1 = {
            "url": "/admin/plugins/"+packageId+"/item_settings.php",
            "method": "POST",
            "data": JSON.stringify({ "new_items_verified": "false", "edited_items_verified": null }),
            "async": false,
            "headers":{
              "Content-Type":"application/json"
            }
        };
        $.ajax(settings_1).done(function(response){
            console.log(JSON.parse(response));
        })
    });

    edited_items_verified.click(function(){
        var settings_1 = {
            "url": "/admin/plugins/"+packageId+"/item_settings.php",
            "method": "POST",
            "data": JSON.stringify({ "new_items_verified": null, "edited_items_verified": "true" }),
            "async": false,
            "headers":{
              "Content-Type":"application/json"
            }
        };
        $.ajax(settings_1).done(function(response){
            console.log(JSON.parse(response));
        })
    });

    edited_items_unverified.click(function(){
        var settings_1 = {
            "url": "/admin/plugins/"+packageId+"/item_settings.php",
            "method": "POST",
            "data": JSON.stringify({ "new_items_verified": null, "edited_items_verified": "false" }),
            "async": false,
            "headers":{
              "Content-Type":"application/json"
            }
        };
        $.ajax(settings_1).done(function(response){
            console.log(JSON.parse(response));
        })
    });


    //run on page load
    function init(){
        //check plugin CF
        var init_settings = {
            "url": "/admin/plugins/"+packageId+"/initialise.php",
            "method": "POST",
            "data": JSON.stringify({"toggle": true}),
            "async": false,
            "headers":{
              "Content-Type":"application/json"
            }
        };
    
        $.ajax(init_settings).done(function(response){
            response = JSON.parse(response);
            //if response = "true". Means the plugin was turned on.
            if(response == "true"){
                var values = document.getElementById("myonoffswitch");
                values.checked = true;
                var settings = {
                    "url": "/admin/plugins/"+packageId+"/check_custom_fields.php",
                    "method": "POST",
                    "data": JSON.stringify({"ONE":[{"ONE":"one"}], "TWO":[{"TWO": "two"}]}),
                    "async": false,
                    "headers":{
                      "Content-Type":"application/json"
                    }
                };
                $.ajax(settings).done(function(response){
                    console.log(JSON.parse(response));
                });
            }
            
            //if response = "false". Means the plugin was toggled off.
            if(response == "false"){
                var values = document.getElementById("myonoffswitch");
                values.checked = false;
            }
            
            //if response = null. Means the plugin was just installed
            if(response == null || response == ""){
                var settings = {
                    "url": "/admin/plugins/"+packageId+"/check_custom_fields.php",
                    "method": "POST",
                    "data": JSON.stringify({"ONE":[{"ONE":"one"}], "TWO":[{"TWO": "two"}]}),
                    "async": false,
                    "headers":{
                      "Content-Type":"application/json"
                    }
                };
                $.ajax(settings).done(function(response){
                    console.log(JSON.parse(response));
                });
            }
        });

        var plugin_settings = {
            "url": "/admin/plugins/"+packageId+"/check_plugin_settings.php",
            "method": "POST",
            "data": JSON.stringify({"toggle": true}),
            "async": false,
            "headers":{
              "Content-Type":"application/json"
            }
        };

        $.ajax(plugin_settings).done(function(response){
            response =JSON.parse(response);
            var x  = document.getElementById("new_items_verified");
            var y = document.getElementById("new_items_unverified");
            var z = document.getElementById("edited_items_verified");
            var a = document.getElementById("edited_items_unverified");

            if(response.new_items == "verified"){
                x.checked = true
            }
            if(response.new_items == "unverified"){
                y.checked = true
            }
            if(response.edited_items == "verified"){
                z.checked = true
            }
            if(response.edited_items == "unverified"){
                a.checked = true
            }
        });
    }

    //enable plugin toggle
    function toggle_plugin(toggle){
        var settings = {
            "url": "/admin/plugins/"+packageId+"/toggle_plugin.php",
            "method": "POST",
            "data": JSON.stringify({"toggle": toggle}),
            "async": false,
            "headers":{
              "Content-Type":"application/json"
            }
        };
    
        $.ajax(settings).done(function(response){
            console.log(JSON.parse(response));
        });
    }
})()