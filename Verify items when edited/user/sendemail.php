<?php

include 'callAPI.php';
include 'admin_token.php';

$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);


// file_put_contents('/error.php', $adminID);
$merchantemail=$content['merchantemail'];
$merchantname=$content['merchantname'];
$adminemail=$content['adminemail'];
$name=$content['name'];
$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$data = 
    [
        'From'=> $merchantemail,
        'To'=> $adminemail,
        'Body'=> $merchantname.' has edited an item: '.$name,
        'Subject'=> 'Item Edited'
    ];   
$url = $baseUrl . '/api/v2/admins/'.$admin_token['UserId'].'/emails';
$sendemail = callAPI('POST', $admin_token['access_token'], $url, $data);
echo json_encode($sendemail);

?>
