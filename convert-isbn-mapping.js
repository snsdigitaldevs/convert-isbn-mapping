const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const URL = require('url').URL;

const PURCHASE_MAP = {
  A: 'Base Course Type',
  B: 'ISBN',
  C: 'Course name',
  D: 'Upsell in-app purchase ISBN',
  E: 'Upsell course name',
  G: 'Upsell web app add-to-cart',
  H: 'Upsell2 in-app purchase ISBN',
  I: 'Upsell2 course name',
  K: 'Upsell2 web app add-to-cart',
  L: 'Upsell2 web app add-to-cart CANADA',
  M: 'Upsell2 web app add-to-cart UK',
  N: 'Upsell2 web app add-to-cart AUSTRALIA',
  O: 'Upgrade in-app purchase ISBN',
  P: 'Upgrade course name',
  R: 'Upgrade web app add-to-cart',
};

const PURCHASE_KEYS_INCLUDE_URL = [
  'Upsell web app add-to-cart',
  'Upsell2 web app add-to-cart',
  'Upsell2 web app add-to-cart CANADA',
  'Upsell2 web app add-to-cart UK',
  'Upsell2 web app add-to-cart AUSTRALIA',
  'Upgrade web app add-to-cart',
];

const FORMAT_MAP = {
  A: 'Base Course Type',
  B: 'ISBN',
  C: 'Course name - Upsell Card & Library',
  D: 'Course name - Learn Page',
  E: 'Course Description - Upsell Card',
  F: 'Other format 1 (Upsell) ISBN',
  G: 'Other format 2 (Upgrade) ISBN',
  H: 'Other format 3 (DVD) ISBN',
};

const result = excelToJson({
  sourceFile: 'isbn-mapping-latest.xlsx',
  sheets: [
    {
      name: 'Purchase map',
      header: {
        rows: 1,
      },
      columnToKey: PURCHASE_MAP,
    },
    {
      name: 'Format map',
      header: {
        rows: 1,
      },
      columnToKey: FORMAT_MAP,
    },
  ],
});

let purchase_map_output = [];
let format_map_output = [];

result['Purchase map'].forEach((item) => {
  for (const key in PURCHASE_MAP) {
    if (!item[PURCHASE_MAP[key]]) {
      item[PURCHASE_MAP[key]] = '';
    }
  }

  PURCHASE_KEYS_INCLUDE_URL.forEach((key) => {
    item[key] = getPidFromURL(item[key]);
  });

  purchase_map_output.push(item);
});

function getPidFromURL(urlString) {
  if (
    urlString &&
    urlString !== 'URL adds product to DW/MG2 cart from web app upsell card'
  ) {
    return new URL(urlString).searchParams.get('pid');
  }
  return urlString;
}

console.log('purchase_map_output length', purchase_map_output.length);

result['Format map'].forEach((item) => {
  for (const key in FORMAT_MAP) {
    if (!item[FORMAT_MAP[key]]) {
      item[FORMAT_MAP[key]] = '';
    }
  }

  format_map_output.push(item);
});
console.log('format_map_output length', format_map_output.length);

purchase_map_output.forEach((item) => {
  let isbn = item['ISBN'];
  let searchItem = format_map_output.find((search) => search['ISBN'] == isbn);
  item['Other format 1 (Upsell) ISBN'] = searchItem
    ? searchItem['Other format 1 (Upsell) ISBN']
    : '';
  item['Other format 2 (Upgrade) ISBN'] = searchItem
    ? searchItem['Other format 2 (Upgrade) ISBN']
    : '';
  item['Other format 3 (DVD) ISBN'] = searchItem
    ? searchItem['Other format 3 (DVD) ISBN']
    : '';
});

var purchase_mapping_json = JSON.stringify(purchase_map_output, null, 4);
fs.writeFile('purchase-mapping.json', purchase_mapping_json, function (err) {
  if (err) throw err;
  console.log('convert purchase-mapping complete');
});

var format_mapping_json = JSON.stringify(format_map_output, null, 4);
fs.writeFile('format-mapping.json', format_mapping_json, function (err) {
  if (err) throw err;
  console.log('convert format-mapping complete');
});
