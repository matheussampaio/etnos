#!/usr/bin/env bash

if [ $# == 1 ]
then

node scriptFormataNomes.js $1/historia_indigena

node scriptRenameFolders.js $1/historia_indigena/alagoas 1 7
node scriptRenameFolders.js $1/historia_indigena/bahia 8 139
node scriptRenameFolders.js $1/historia_indigena/bahia_ca 147 53
node scriptRenameFolders.js $1/historia_indigena/bahia_lf 200 52
node scriptRenameFolders.js $1/historia_indigena/ceara 252 34
node scriptRenameFolders.js $1/historia_indigena/espirito_santo 286 13
node scriptRenameFolders.js $1/historia_indigena/goias 299 169
node scriptRenameFolders.js $1/historia_indigena/maranhao 468 589
node scriptRenameFolders.js $1/historia_indigena/mato_grosso 1057 161
node scriptRenameFolders.js $1/historia_indigena/minas_gerais 1218 92
node scriptRenameFolders.js $1/historia_indigena/para 1310 851
node scriptRenameFolders.js $1/historia_indigena/paraiba 2161 65
node scriptRenameFolders.js $1/historia_indigena/pernambuco 2226 220
node scriptRenameFolders.js $1/historia_indigena/piaui 2446 70
node scriptRenameFolders.js $1/historia_indigena/rio_da_prata 2516 14
node scriptRenameFolders.js $1/historia_indigena/rio_de_janeiro 2530 135
node scriptRenameFolders.js $1/historia_indigena/rio_de_janeiro_ca 2665 99
node scriptRenameFolders.js $1/historia_indigena/rio_grande_do_norte 2764 30
node scriptRenameFolders.js $1/historia_indigena/rio_grande_do_sul 2794 12
node scriptRenameFolders.js $1/historia_indigena/rio_negro 2806 94
node scriptRenameFolders.js $1/historia_indigena/santa_catarina 2900 6
node scriptRenameFolders.js $1/historia_indigena/sao_paulo 2906 11
node scriptRenameFolders.js $1/historia_indigena/sao_paulo_mg 2917 127
node scriptRenameFolders.js $1/historia_indigena/sergipe 3044 2
# node scriptRenameFolders.js $1/historia_indigena/x_codices 3046 73

node scriptGenerateJSON.js $1/historia_indigena

else
    echo "missing parent_dir"
fi