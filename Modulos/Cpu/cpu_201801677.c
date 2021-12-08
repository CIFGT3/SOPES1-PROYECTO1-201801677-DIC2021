//HEADERS
#include <linux/module.h> // obligatorio para crear un modulo
#include <linux/kernel.h> // para usar KERN_INFO

#include <linux/init.h> // para los macros module_init y module_exit
#include <linux/proc_fs.h> // header para utilizar proc_fs
#include <asm/uaccess.h> // for copy_from_user
#include <linux/seq_file.h> // libreria seq_file y manejar el archivo en /proc/

#include <linux/sched.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de cpu, Proyecto 1 SO1 - 201801677");
MODULE_AUTHOR("Julio Emiliano Cifuentes Zabala");


struct task_struct *proceso;//, *hijo;
//struct list_head *procesos_hijos;


// Funcion a ejecutarse cada vez que se lea el archivo ubicado en /proc
static int escribir_archivo(struct seq_file *archivo, void *v){
    
    seq_printf(archivo, "Escribiendo en el modulo CPU\n");
    for_each_process(proceso){
        seq_printf(archivo, "Proceso %s (PID: %d)\n", proceso->comm, proceso->pid);
    }
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
    proc_create("cpu_201801677",0,NULL, &operaciones);
    printk(KERN_INFO "Julio Emiliano Cifuentes Zabala\n"); // mensaje a mostrar al crear el modulo
    return 0;
}

// Funcion que se ejecuta al quitar el modulo en el kernel con rmmod
static void _remove(void){
    remove_proc_entry("cpu_201801677", NULL);
    printk(KERN_INFO "Diciembre 2021\n"); // mensaje al remover el modulo
}

module_init(_insert);
module_exit(_remove);