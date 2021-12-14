# Repositorio para Proyecto 1 de SOPES 1

## Backend - Go

Instalar golang con el comando
```sudo apt install golang```

Levantar el servidor
```sudo sh ./build.sh```

## Frontend - Angular

Levantar el servidor web
```ng serve```

Crear componentes
```ng g c <nombre>```

Crear servicios
```ng g s <nombre>```

Libreria de ngx-charts



## Modulos
Realizados en distro Ubuntu 20.04 LTS

Primero instalar los headers necesarios con el siguiente comando

```sudo apt-get install build-essential linux-headers-$(uname -r)```

### Comandos

Compilar el archivo:
```make all o make```

Insertar modulo:
```sudo insmod <nombre>.ko```

Verificar los mensajes:
```dmesg```

Eliminar el buffer de mensajes:
```sudo dmesg -C```

Ubicarnos en el directorio /proc/:
```cd /proc/```

Ver los modulos existentes en el directorio /proc/:
```lsmod```

Leer el archivo que se acaba de escribir:
```cat <nombre>```

Eliminar el modulo:
```sudo rmmod <nombre>```