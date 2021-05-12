# Item Verification

These 2 Plug-Ins enable the marketplace admin to vet/approve/verify items. This means when a merchant uploads **or** edits an item, that item is made invisible and non-purchasable by any buyer.

Merchants cannot change this setting unless the marketplace admin approves the item by making it purchasable on the admin portal.

## Installation by developer
Download/clone this repository and choose one of the following (or both - recommended) to install:
* [Verify items when created](https://github.com/Arcadier/Item-Verification/tree/main/Verify%20items%20when%20created)
* [Verify items when edited](https://github.com/Arcadier/Item-Verification/tree/main/Verify%20items%20when%20created)

On your developer dashboard, compress the `admin` and `user` folders together and upload the compressed file as a Plug-In. Instructions on how to install a Plug-In can be found [here.](https://api.arcadier.com/uploading-publishing-plugin)

The following custom tables are needed for the plug-ins to work:

### Verify items when created
Custom Table name: **cache**

Column names & Data Type:
* "item" - string
* "status" - Integer
* "merchant" - string
* "name" - string

### Verify items when edited
Custom Table name: **edit_cache**

Column names & Data Type:
* "item" - string
* "status" - Integer
* "merchant" - string
* "name" - string



