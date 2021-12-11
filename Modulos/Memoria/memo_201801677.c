//HEADERS
#include <linux/module.h> // obligatorio para crear un modulo
#include <linux/kernel.h> // para usar KERN_INFO

#include <linux/init.h> // para los macros module_init y module_exit
#include <linux/proc_fs.h> // header para utilizar proc_fs
#include <asm/uaccess.h> // for copy_from_user
#include <linux/seq_file.h> // libreria seq_file y manejar el archivo en /proc/

#include <linux/hugetlb.h> // para utilizar si_meminfo
//#include <linux/vmstat.h> // librerias para calcular la memoria cache
//#include <linux/swap.h>
//#include <linux/mmzone.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de memoria, Proyecto 1 SO1 - 201801677");
MODULE_AUTHOR("Julio Emiliano Cifuentes Zabala");

struct sysinfo info;

//funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int escribir_archivo(struct seq_file *archivo, void *v){   
    // aqui recoger la info de la memoria
    long totalram, freeram, sharedram, bufferram;
    long totalswap, freeswap, totalhigh, freehigh;
    int mem_unit;
    si_meminfo(&info);
    /*
    long cache;
    cache = global_node_page_state(NR_FILE_PAGES) -
			total_swapcache_pages() - info.bufferram;
    if (cache < 0){
        cache = 0;
    }
    */
    mem_unit = info.mem_unit; // es el multiplo por el que se muestran los tamanios en bytes
    // dimensiones convertidas a MB
    totalram = (info.totalram*mem_unit)/(1024*1024);
    freeram = (info.freeram*mem_unit)/(1024*1024); // no es memoria libre, si no memoria que esta siendo ocupada
    sharedram = (info.sharedram*mem_unit)/(1024*1024);
    bufferram = (info.bufferram*mem_unit)/(1024*1024);
    totalswap = (info.totalswap*mem_unit)/(1024*1024);
    freeswap = (info.freeswap*mem_unit)/(1024*1024);
    totalhigh = (info.totalhigh*mem_unit)/(1024*1024);
    freehigh = (info.freehigh*mem_unit)/(1024*1024);
    // escribir info
    seq_printf(archivo, "{\n");
    seq_printf(archivo, "\t\"totalram\":%8li,\n", totalram);
    seq_printf(archivo, "\t\"freeram\":%8li,\n", freeram);
    seq_printf(archivo, "\t\"sharedram\":%8li,\n", sharedram);
    seq_printf(archivo, "\t\"bufferram\":%8li,\n", bufferram);
    seq_printf(archivo, "\t\"totalswap\":%8li,\n", totalswap);
    seq_printf(archivo, "\t\"freeswap\":%8li,\n", freeswap);
    seq_printf(archivo, "\t\"totalhigh\":%8li,\n", totalhigh);
    seq_printf(archivo, "\t\"freehigh\":%8li,\n", freehigh);
    seq_printf(archivo, "\t\"memunit\":%d,\n", mem_unit);
    seq_printf(archivo, "\t\"cache\": 0\n");
    //seq_printf(archivo, "\t\"cache\": %8li\n", cache);
    seq_printf(archivo, "}\n");
    return 0;
}

static int abrir(struct inode *inode, struct file *file){
    return single_open(file, escribir_archivo, NULL);
}

// proc_ops
static struct proc_ops operaciones = {
    .proc_open = abrir,
    .proc_read = seq_read
};


// Funcion que se ejecuta al insertar el modulo en el kernel con insmod
static int _insert(void){
    proc_create("memo_201801677",0,NULL, &operaciones);
    printk(KERN_INFO "201801677\n"); // mensaje a mostrar al crear el modulo
    return 0;
}

// Funcion que se ejecuta al quitar el modulo en el kernel con rmmod
static void _remove(void){
    remove_proc_entry("memo_201801677", NULL);
    printk(KERN_INFO "Sistemas Operativos 1\n"); // mensaje al remover el modulo
}

module_init(_insert);
module_exit(_remove);