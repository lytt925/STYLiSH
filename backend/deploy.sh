#!/bin/bash

tar czf stylish_backend.tar.gz src package-lock.json package.json
scp stylish_backend.tar.gz ubuntu@44.217.27.217:~
rm stylish_backend.tar.gz

ssh ubuntu@44.217.27.217 << 'ENDSSH'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
pm2 stop stylish
find stylish -mindepth 1 -type f ! -name '.env' -exec rm {} + -o -mindepth 1 -type d -exec rm -r {} +
tar xf stylish_backend.tar.gz -C stylish
rm stylish_backend.tar.gz
cd stylish
npm install
pm2 start stylish
ENDSSH
