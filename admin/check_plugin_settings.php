<?php 

    include 'callAPI.php';
    include 'admin_token.php';

    $contentBodyJson = file_get_contents('php://input');
    $content = json_decode($contentBodyJson, true);

    $baseUrl = getMarketplaceBaseUrl();
    $admin_token = getAdminToken();
    $packageID = getPackageID();
    $new_item_cf_code = '';
    $edited_item_cf_code = '';
    $toggle_value = '';
    $i=0;
    $result = [
        'new_items' => '',
        'edited_items' => ''
    ];

    $url = $baseUrl.'/api/v2/packages/'.$packageID.'/custom-field-definitions';
    $plugin_cf = callAPI('GET', $admin_token['access_token'], $url, null);
    
    for($i; $i < count($plugin_cf); $i++){
        if($plugin_cf[$i]['Name'] == 'new_items'){
            $new_item_cf_code = $plugin_cf[$i]['Code'];
            error_log($new_item_cf_code);
        }
        if($plugin_cf[$i]['Name'] == 'edited_items'){
            $edited_item_cf_code = $plugin_cf[$i]['Code'];
            error_log($edited_item_cf_code);
        }
    }

    $url = $baseUrl.'/api/v2/marketplaces';
    $response = callAPI('GET', $admin_token['access_token'], $url, false);
    $length = count($response['CustomFields']);
    for($i;$i<$length;$i++){
        if($response['CustomFields'][$i]['Code'] == $new_item_cf_code){
            $result['new_items'] = $response['CustomFields'][$i]['Values'][0];
        }
        if($response['CustomFields'][$i]['Code'] == $edited_item_cf_code){
            $result['edited_items'] = $response['CustomFields'][$i]['Values'][0];
        }
    }

    echo json_encode($result);

?>
