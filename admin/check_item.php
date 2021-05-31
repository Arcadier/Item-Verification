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

    $url = $baseUrl.'/api/v2/items/'.$content['id'];
    $response = callAPI('GET', $admin_token['access_token'], $url, false);
    $data = [
        'verified_cf' => '',
        'IsAvailable' => ''
    ];
    $length = count($response['CustomFields']);
    for($i;$i<$length;$i++){
        if($response['CustomFields'][$i]['Code'] == 'Vetting-Verified'){
            $data['verified_cf'] = $response['CustomFields'][$i]['Values'][0];
        }
    }

    $data['IsAvailable'] = $response['IsAvailable'];
    
    echo json_encode($data);
?>