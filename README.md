# convert-isbn-mapping
In Pimsleur BFF side, we need `purchase-mapping.json` to construct the purchase mapping relations and also `format-mapping.json` to configure the ISBN name and descriptions.

S&S will provide such metadata in excel format. So, we need convert the data to json first.

## Before Run
please run `npm install` to install the dependencies.

## File Requirement
The source file should be an excel file named as `isbn-mapping-latest.xlsx` which contains two sheets: `Purchase map` and `Format map`. And the columns headers should be the same as example file.

please run `node convert-isbn-mapping.js` you can get `purchase-mapping.json` and `format-mapping.json`

## How to use the result
After get the json result, please verify that the json length is the same as expected.

Copy the `purchase-mapping.json` and `format-mapping.json` under location `resources/isbn-mapping` into [UnlimitedBackend](https://github.com/snsdigitaldevs/UnlimitedBackend) code repository. 