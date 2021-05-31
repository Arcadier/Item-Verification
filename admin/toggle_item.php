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

    $url = $baseUrl.'/api/v2/items/'.$content['itemID'];
    $response = callAPI('GET', $admin_token['access_token'], $url, false);
    $merchantID = $response['MerchantDetail']['ID'];

    $url = $baseUrl.'/api/v2/merchants/'.$merchantID.'/items/'.$content['itemID'];
    if($content['choice'] == 'Verified'){
        $settings_value = true;
    }
    else{
        $settings_value = false;
    }
    $data = [
        'IsAvailable' => $settings_value,
        'IsVisibleToCustomer' => $settings_value,
        'CustomFields' => [
            [
                'Code' => 'Vetting-Verified',
                'Values' => [
                    $content['choice']
                ]
            ]
        ]
    ];
    $response = callAPI('PUT', $admin_token['access_token'], $url, $data);
    $length = count($response['CustomFields']);
    for($i;$i<$length;$i++){
        if($response['CustomFields'][$i]['Code'] == 'Vetting-Verified' && $response['CustomFields'][$i]['Values'][0] == $content['choice']){
            echo json_encode("success");
        }
    }
?>