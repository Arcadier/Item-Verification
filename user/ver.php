<?php
    include 'callAPI.php';
    include 'admin_token.php';

    $contentBodyJson = file_get_contents('php://input');
    $content = json_decode($contentBodyJson, true);

    $baseUrl = getMarketplaceBaseUrl();
    $admin_token = getAdminToken();
    $packageID = getPackageID();
    $plugin_cf_code = '';
    $toggle_value = '';
    $new_items_cf_code = '';
    $edited_items_cf_code = '';
    $plugin_switch_cf_code = '';
    $i=0;
    $j=0;
    $k=0;

    $url = $baseUrl.'/api/v2/packages/'.$packageID.'/custom-field-definitions/';
    $response = callAPI('GET', $admin_token['access_token'], $url, false);
    $length = count($response);
    
    for($j;$j<$length;$j++){
        if($response[$j]['ReferenceTable'] == 'Implementations' && $response[$j]['Name'] == 'new_items'){
            $new_items_cf_code = $response[$j]['Code'];
            error_log($new_items_cf_code);
        }
        if($response[$j]['ReferenceTable'] == 'Implementations' && $response[$j]['Name'] == 'edited_items'){
            $edited_items_cf_code = $response[$j]['Code'];
            error_log($edited_items_cf_code);
        }
        if($response[$j]['ReferenceTable'] == 'Implementations' && $response[$j]['Name'] == 'Item verification'){
            $plugin_switch_cf_code = $response[$j]['Code'];
            error_log($edited_items_cf_code);
        }
    }

    $url = $baseUrl.'/api/v2/marketplaces';
    $response = callAPI('GET', $admin_token['access_token'], $url, false); 
    $size = count($response['CustomFields']);
    for($k;$k<$size;$k++){
        if($response['CustomFields'][$k]['Code'] == $plugin_switch_cf_code){
            $plugin_switch_cf_value = $response['CustomFields'][$k]['Values'][0];
        }
    } 
    
    if($plugin_switch_cf_value == "true"){
        if($content['event'] == 'create'){
            $url = $baseUrl.'/api/v2/marketplaces';
            $response = callAPI('GET', $admin_token['access_token'], $url, false);   
            
            $marketplace_cf_array = $response['CustomFields'];
            $length = count($marketplace_cf_array);
        
            for($i = 0; $i < $length; $i++){
                if($marketplace_cf_array[$i]['Code'] == $new_items_cf_code){
                    if($marketplace_cf_array[$i]['Values'][0] == 'verified'){
                        echo json_encode(true);
                    }
                    else{
                        echo json_encode(false);
                    }
                }
            }
        }
    
    
        if($content['event'] == 'edit'){
                
            $url = $baseUrl.'/api/v2/marketplaces';
            $response = callAPI('GET', $admin_token['access_token'], $url, false);   
            
            $marketplace_cf_array = $response['CustomFields'];
            $length = count($marketplace_cf_array);
        
            for($i = 0; $i < $length; $i++){
                if($marketplace_cf_array[$i]['Code'] ==  $edited_items_cf_code){
                    if($marketplace_cf_array[$i]['Values'][0] == 'verified'){
                        echo json_encode(true);
                    }
                    else{
                        echo json_encode(false);
                    }
                }
            }
        }
    }
    else{
        echo json_encode(true);
    }

    
    
?>