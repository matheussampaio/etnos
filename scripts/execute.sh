#!/usr/bin/env bash

if [ $# == 1 ]
then

node scriptFormataNomes.js $1/historia_indigena

node scriptRenameFolders.js $1/historia_indigena/alagoas 1 7
node scriptRenameFolders.js $1/historia_indigena/bahia 8 146
node scriptRenameFolders.js $1/historia_indigena/bahia_ca 147 199
node scriptRenameFolders.js $1/historia_indigena/bahia_lf 200 251
node scriptRenameFolders.js $1/historia_indigena/ceara 252 285
node scriptRenameFolders.js $1/historia_indigena/espirito_santo 286 298
node scriptRenameFolders.js $1/historia_indigena/goias 299 467
node scriptRenameFolders.js $1/historia_indigena/maranhao 468 1056
node scriptRenameFolders.js $1/historia_indigena/mato_grosso 1057 1217
node scriptRenameFolders.js $1/historia_indigena/minas_gerais 1218 1309
node scriptRenameFolders.js $1/historia_indigena/para 1310 2160
node scriptRenameFolders.js $1/historia_indigena/paraiba 2161 2225
node scriptRenameFolders.js $1/historia_indigena/pernambuco 2226 2445
node scriptRenameFolders.js $1/historia_indigena/piaui 2446 2515
node scriptRenameFolders.js $1/historia_indigena/rio_da_prata 2516 2529
node scriptRenameFolders.js $1/historia_indigena/rio_de_janeiro 2530 2664
node scriptRenameFolders.js $1/historia_indigena/rio_de_janeiro_ca 2665 2763
node scriptRenameFolders.js $1/historia_indigena/rio_grande_do_norte 2764 2793
node scriptRenameFolders.js $1/historia_indigena/rio_grande_do_sul 2794 2805
node scriptRenameFolders.js $1/historia_indigena/rio_negro 2806 2899
node scriptRenameFolders.js $1/historia_indigena/santa_catarina 2900 2905
node scriptRenameFolders.js $1/historia_indigena/sao_paulo 2906 2916
node scriptRenameFolders.js $1/historia_indigena/sao_paulo_mg 2917 3043
node scriptRenameFolders.js $1/historia_indigena/sergipe 3044 3045
# node scriptRenameFolders.js $1/historia_indigena/codices 3046 3118

node scriptGenerateJSON.js $1/historia_indigena

else
    echo "missing parent_dir"
fi