<?php
    include 'callAPI.php';
    include 'admin_token.php';

    $contentBodyJson = file_get_contents('php://input');
    $content = json_decode($contentBodyJson, true);

    $baseUrl = getMarketplaceBaseUrl();
    $admin_token = getAdminToken();
    $packageID = getPackageID();
    $plugin_cf_code = '';
    $i=0;
    error_log('new_items_verified: '.$content['new_items_verified'].', edited_items_verified: '.$content['edited_items_verified']);

    if($content['new_items_verified'] != null && $content['new_items_verified'] == "true"){
        
        $url = $baseUrl.'/api/v2/packages/'.$packageID.'/custom-field-definitions';
        $plugin_cf = callAPI('GET', $admin_token['access_token'], $url, null);
        

        for($i; $i < count($plugin_cf); $i++){
            if($plugin_cf[$i]['Name'] == 'new_items'){
                $plugin_cf_code = $plugin_cf[$i]['Code'];
                error_log($plugin_cf_code);
            }
        }
        $data = [
            'CustomFields' => [
                [
                    'Code' => $plugin_cf_code,
                    'Values' => [
                        'verified'
                    ]
                ]
            ]
        ];
        $url = $baseUrl.'/api/v2/marketplaces';
        $response = callAPI('POST', $admin_token['access_token'], $url, $data); 
        echo json_encode($response['CustomFields'][10]);    
    
    }

    if($content['new_items_verified'] != null && $content['new_items_verified'] == "false"){
        $url = $baseUrl.'/api/v2/packages/'.$packageID.'/custom-field-definitions';
        $plugin_cf = callAPI('GET', $admin_token['access_token'], $url, null);
        

        for($i; $i < count($plugin_cf); $i++){
            if($plugin_cf[$i]['Name'] == 'new_items'){
                $plugin_cf_code = $plugin_cf[$i]['Code'];
                error_log($plugin_cf_code);
            }
        }
        $data = [
            'CustomFields' => [
                [
                    'Code' => $plugin_cf_code,
                    'Values' => [
                        'unverified'
                    ]
                ]
            ]
        ];
        $url = $baseUrl.'/api/v2/marketplaces';
        $response = callAPI('POST', $admin_token['access_token'], $url, $data);
        echo json_encode($response['CustomFields'][10]);   
    }

    if($content['new_items_verified'] == null && $content['edited_items_verified'] == "true"){
        $url = $baseUrl.'/api/v2/packages/'.$packageID.'/custom-field-definitions';
        $plugin_cf = callAPI('GET', $admin_token['access_token'], $url, null);
        

        for($i; $i < count($plugin_cf); $i++){
            if($plugin_cf[$i]['Name'] == 'edited_items'){
                $plugin_cf_code = $plugin_cf[$i]['Code'];
            }
        }
        $data = [
            'CustomFields' => [
                [
                    'Code' => $plugin_cf_code,
                    'Values' => [
                        'verified'
                    ]
                ]
            ]
        ];
        $url = $baseUrl.'/api/v2/marketplaces';
        $response = callAPI('POST', $admin_token['access_token'], $url, $data); 
        echo json_encode($response['CustomFields'][11]);    
    }

    if($content['new_items_verified'] == null && $content['edited_items_verified'] == "false"){
        $url = $baseUrl.'/api/v2/packages/'.$packageID.'/custom-field-definitions';
        $plugin_cf = callAPI('GET', $admin_token['access_token'], $url, null);
        

        for($i; $i < count($plugin_cf); $i++){
            if($plugin_cf[$i]['Name'] == 'edited_items'){
                $plugin_cf_code = $plugin_cf[$i]['Code'];
            }
        }
        $data = [
            'CustomFields' => [
                [
                    'Code' => $plugin_cf_code,
                    'Values' => [
                        'unverified'
                    ]
                ]
            ]
        ];
        $url = $baseUrl.'/api/v2/marketplaces';
        $response = callAPI('POST', $admin_token['access_token'], $url, $data);
        echo json_encode($response['CustomFields'][11]);     
    }

?>