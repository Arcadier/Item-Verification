<?php
include 'callAPI.php';
include 'admin_token.php';

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$i=0;
$verified_cf_exists = false;
$success = [];

$packageID = getPackageID();
$url = $baseUrl . '/api/v2/admins/'.$admin_token['UserId'].'/custom-field-definitions/';
$response = callAPI('GET', $admin_token['access_token'], $url, null);

$custom_fields_length = count($response['Records']);
for($i=0;$i<$custom_fields_length;$i++){
    if($response['Records'][$i]['ReferenceTable'] == "Items" && $response['Records'][$i]['Code'] == "Vetting-Verified"){
        $verified_cf_exists = true;
    }
}

if($verified_cf_exists == false){
    $url = $baseUrl . '/api/v2/admins/'.$admin_token['UserId'].'/custom-field-definitions/';
    $data = [
        'Code' => 'Vetting-Verified',
        'Name' => 'Vetting-Verified',
        'IsMandatory' => true,
        'DataInputType' => 'dropdown',
        'ReferenceTable' => 'Items',
        'DataFieldType' => 'list',
        'IsSearchable' => true,
        'IsSensitive' => true,
        'Active' => true,
        'Options' => [
            [
                'Name' => 'Verified'
            ],
            [
                'Name' => 'Unverified'
            ]
        ]
    ];
    $response = callAPI('POST', $admin_token['access_token'], $url, $data);

    if($response['Code'] == 'Vetting-Verified'){
        $success = [
            'custom_field_exists' => true,
            'just_created' => true
        ];
    }
    else{
        $success = [
            'custom_field_exists' => false,
            'just_created' => false
        ];
    }

    echo json_encode($success);
}
else{
    $success = [
        'custom_field_exists' => true,
        'just_created' => false
    ];
    echo json_encode($success);
}

?>