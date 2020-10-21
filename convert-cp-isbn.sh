#!/bin/bash
target_dir=${1:-"../"}
RED='\033[0;31m'
GREEN='\033[0;32m'

rm -f format-mapping.json purchase-mapping.json
node convert-isbn-mapping.js
if [ $? != 0 ]; then
    echo -e  "${RED} run convert-isbn-mapping error"
    exit 1
fi

rm -f $target_dir/UnlimitedBackend/src/main/resources/isbn-mapping/format-mapping.json
rm -f $target_dir/UnlimitedBackend/src/main/resources/isbn-mapping/purchase-mapping.json
cp ./format-mapping.json $target_dir/UnlimitedBackend/src/main/resources/isbn-mapping/
cp ./purchase-mapping.json $target_dir/UnlimitedBackend/src/main/resources/isbn-mapping/ &&
echo -e  "${GREEN} run success"

