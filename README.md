# Item Verification

This Plug-In enable the marketplace admin to vet/approve/verify items. This means when a merchant uploads **or** edits an item, that item is made invisible and non-purchasable by any buyer.

Merchants cannot change this setting unless the marketplace admin approves the item by making it purchasable/verifying it on the admin portal.

## Installation by developer
* Download/clone this repository.
* *If downloaded*, unzip the downloaded file and zip the contents of `Item-Verification-main` in its own root zip file. (The resulting zip file should contain only the `admin` and `user` folders). Skip this step if you cloned.
* On your developer dashboard, compress the `admin` and `user` folders together and upload the compressed file as a Plug-In. Instructions on how to install a Plug-In can be found [here.](https://api.arcadier.com/uploading-publishing-plugin).
* Create the following 3 custom fields:
  * Item verification
    * Field Name: **Item verification**
    * Field Type: **textfield**
    * Reference Table: **Implementations**
    * Sensitive Data: **Yes**
  * new_items
    * Field Name: **new_items**
    * Field Type: **textfield**
    * Reference Table: **Implementations**
    * Sensitive Data: **Yes**
  * edited_items
    * Field Name: **edited_items**
    * Field Type: **textfield**
    * Reference Table: **Implementations**
    * Sensitive Data: **Yes**
* Save the Plug-In.
* Install on your marketplace.

## Usage
Once installed on your marketplace, you will see the following interface:




