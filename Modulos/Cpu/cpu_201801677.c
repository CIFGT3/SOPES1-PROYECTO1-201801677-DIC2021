//HEADERS
#include <linux/module.h> // obligatorio para crear un modulo
#include <linux/kernel.h> // para usar KERN_INFO

#include <linux/init.h> // para los macros module_init y module_exit
#include <linux/proc_fs.h> // header para utilizar proc_fs
#include <asm/uaccess.h> // for copy_from_user
#include <linux/seq_file.h> // libreria seq_file y manejar el archivo en /proc/

#include <linux/mm.h>  // get_mm_rss()
#include <linux/sched.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de cpu, Proyecto 1 SO1 - 201801677");
MODULE_AUTHOR("Julio Emiliano Cifuentes Zabala");


struct task_struct *proceso, *hijo;
struct list_head *procesos_hijos;


// Funcion a ejecutarse cada vez que se lea el archivo ubicado en /proc
static int escribir_archivo(struct seq_file *archivo, void *v){
    
    int contador_procesos, contador;
    contador_procesos = 0;
    contador = 0;
    for_each_process(proceso){
        contador_procesos = contador_procesos+1;
    }
    seq_printf(archivo, "[\n");
    for_each_process(proceso){
        unsigned long rss;
        if(proceso->mm){
            rss = get_mm_rss(proceso->mm) << PAGE_SHIFT;
        }else{
            rss = 0;
        }
        contador = contador+1;
        seq_printf(archivo, "\t{\n");
        // estado
        seq_printf(archivo, "\t\"state\": %8li,\n", proceso->state);
        seq_printf(archivo, "\t\"process\": \"%s\",\n", proceso-> comm);
        seq_printf(archivo, "\t\"pid\": %d,\n", proceso->pid);
        //__kuid_val(task_uid(proceso)) que es otra manera de obtener el id del usuario
        seq_printf(archivo, "\t\"userid\": %d,\n", proceso->real_cred->uid);
        seq_printf(archivo, "\t\"ram\": %8lu,\n", rss); // en bytes
        int contador_procesos_hijos;
        contador_procesos_hijos = 0;
        list_for_each(procesos_hijos, &(proceso->children)){
            contador_procesos_hijos = contador_procesos_hijos+1;
        }
        seq_printf(archivo, "\t\"hijos\": [");
        int contador2;
        contador2 = 0;
        if(contador_procesos_hijos>0){
            list_for_each(procesos_hijos, &(proceso->children)){
                contador2 = contador2+1;
                seq_printf(archivo, " {\n");
                hijo = list_entry(procesos_hijos, struct task_struct, sibling);
                seq_printf(archivo, "\t\t\"process\": \"%s\",\n", hijo->comm);
                seq_printf(archivo, "\t\t\"pid\": %d\n", hijo->pid);
                seq_printf(archivo, "\t}");
                if(contador2<contador_procesos_hijos){
                    seq_printf(archivo,",");
                }else{
                    seq_printf(archivo, "]");
                }
            }
        }else{
            seq_printf(archivo, "]\n");
        }
        //seq_printf(archivo, "\t}\n");
        seq_printf(archivo, "\t}");
        if(contador<contador_procesos){
            seq_printf(archivo,",\n");
        }
    }
    seq_printf(archivo, "\n]\n");

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