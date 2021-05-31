<?php
    include 'callAPI.php';
    include 'admin_token.php';

    $contentBodyJson = file_get_contents('php://input');
    $content = json_decode($contentBodyJson, true);

    $baseUrl = getMarketplaceBaseUrl();
    $admin_token = getAdminToken();
    $packageID = getPackageID();
    $plugin_cf_value;
    $i=0;
    $j=0;
    $plugin_switch_cf_code = '';

    $url = $baseUrl.'/api/v2/packages/'.$packageID.'/custom-field-definitions/';
    $response = callAPI('GET', $admin_token['access_token'], $url, false);
    $length = count($response);
    
    for($j;$j<$length;$j++){
        if($response[$j]['ReferenceTable'] == 'Implementations' && $response[$j]['Name'] == 'Item verification'){
            $plugin_switch_cf_code = $response[$j]['Code'];
            $plugin_switch_cf_value = $response[$j]['Values'][0];
            error_log($edited_items_cf_code);
        }
    }

    $url = $baseUrl.'/api/v2/marketplaces';
    $response = callAPI('GET', $admin_token['access_token'], $url, false);

    $custom_fields = $response['CustomFields'];
    $length = count($custom_fields);
    
    for($i;$i<$length;$i++){
        if($custom_fields[$i]['Code'] == $plugin_switch_cf_code){
            // echo json_encode($custom_fields[$i]);
            // error_log($custom_fields);
            if($custom_fields[$i]['Values'][0] == "true"){
                $plugin_cf_value = true;
            }
            else{
                $plugin_cf_value = false;
            }
        }
    }

    echo json_encode($plugin_cf_value);
?>