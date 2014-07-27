# -*- coding: utf-8 -*-
# este script percorre cada pasta, 
# entra e em cada uma renomeia seus subdiretorios
# entra em cada subdiretório renomeia os arquivos
# e escreve no json 


import os,sys

#caminho para os arquivos
basedir = '/home/treinamento-sony/metodos'

#arquivo a ser escrito
target = open('/home/treinamento-sony/write.json', 'w')

#inicio do json
target.write("[")
target.write("\n")

#contador de verbetes
cont  = 0

#lista dos estados a ser ordenada
#no pai
lista = os.listdir(basedir)

print "The dir is: %s"%lista

#lista dos estados ordenada
lista = sorted(lista)

print "The dir is: %s"%lista

#for para correr a lista dos estados
for fn in lista:

  #se não for diretório passa (mas só existe diretórios)
  if not os.path.isdir(os.path.join(basedir, fn)):
    continue # Not a directory

  #o caminho de cada pasta dentro dos estados
  #nó filho
  son = os.path.join(basedir, fn)

  #lista dos diretórios dentro do filho
  listaSon = os.listdir(son)
  #lista do filho ordenada
  listaSon = sorted(listaSon)

  #loop para correr cada diretório que contém verbetes
  for (count,fd) in enumerate(listaSon):
    
  	#se não for diretório passa
    if not os.path.isdir(os.path.join(son, fd)):
      continue # Not a directory
    

    #começa a escrever no json
    cont = cont + 1
    target.write(" {")
    target.write("\n")
    #linha com id
    target.write('  "id":' +'"'+ str(cont)+'",')
    target.write("\n")
    #linha para verbete
    target.write('  "snippet":"Verbete '+ str(cont)+'.",')
    target.write("\n")
    #linha do caminho
    target.write('  "path": "../files/'+fn+"/"+str(cont)+'",')
    target.write("\n")
    #linha com lista das imagens
    linhas = '  "imagens": ['

    #caminho para cada arquivo .TIF
    #nó neto
    granson = os.path.join(son, fd)


    #lista dos arquivos dentro do neto
    listaGranSon = os.listdir(granson)
    #lista ordenada
    listaGranSon = sorted(listaGranSon)

    #contador para renomear os .TIF
    cont2 = 0

    #loop para correr os cada arquivo .TIF
    for (count2,fs) in enumerate(listaGranSon):


      cont2 = cont2 + 1
      #renomeia o arquivo
      os.renames(os.path.join(granson, fs),
           os.path.join(granson, str(cont2)))
      #acrescenta no atributo linhas
      linhas = linhas + '"'+str(cont2)+'.TIF"'+","

    #retira ultima virgula
    linhafinal=linhas[:len(linhas)-1] 
    
    #escreve no json na linha que contém a lista de imagens
    target.write(linhafinal)
    #fecha o imagens
    target.write("]")
    target.write("\n")

    #renomeia o diretório do verbete seguindo o contador de verbetes
    os.renames(os.path.join(son, fd),
            os.path.join(son, str(cont)))

    #fecha json
    target.write(" },")
    target.write("\n")
#fecha json
target.write("]")
target.close


