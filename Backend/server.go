package main

import(
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"io/ioutil" 
	"encoding/json"
	"strconv"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool { return true },
}

// STRUCTS PARA MODULO RAM
type Model_Ram struct {
	Totalram int 		`json:"totalram"`
	Freeram int 		`json:"freeram"`
	Sharedram int 		`json:"sharedram"`
	Bufferram int		`json:"bufferram"`
	Totalswap int		`json:"totalswap"`
	Freeswap int		`json:"freeswap"`
	Totalhigh int		`json:"totalhigh"`
	Freehigh int		`json:"freehigh"`
	Memunit	int			`json:"memunit"`
	Cache float64			`json:"cache"`
}

// STRUCTS PARA MODULO CPU Y PAGINA PRINCIPAL
type Model_Cpu struct {
	State	int		`json:"state"`
	Process string 	`json:"process"`
	Pid 	int		`json:"pid"`
	Userid	int 	`json:"userid"`
	User 	string	`json:"user"`
	Ram 	float64	`json:"ram"`
	Hijos []Children_Process `json:"hijos"`
}

type Children_Process struct{
	Process string 	`json:"process"`
	Uid		int 	`json:"pid"`
}

type Send_Cpu struct {
	Running		int 	`json:"running"`
	Stopped 	int 	`json:"stopped"`
	Sleeping 	int 	`json:"sleeping"`
	Uninterruptible int 	`json:"uninterruptible"`
	Zombie		int 	`json:"zombie"`
	Desconocido int 	`json:"desconocido"`
	Total		int 	`json:"total"`
	Procesos []Model_Cpu	`json:"procesos"`
	Status 		int 	`json:"status"`
}

type User struct {
	Name string	`json:"name"`
	Uid  int 	`json:"uid"`
}

type Kill struct {
	Pid int 	`json:"pid"`
}

type Status struct{
	Status string `json:"status"`
}

// home
func home(w http.ResponseWriter, r *http.Request){
	fmt.Fprintf(w, "Servidor proyecto 1 de Sistemas Operativos 1")
}

// endpoint para leer el archivo de memoria
func getRamData(w http.ResponseWriter, r *http.Request){
	//fmt.Println("Entra a /getRam")
	out, err := ioutil.ReadFile("/proc/memo_201801677")
	if err!=nil{
		log.Fatal(err)
	}
	texto := string(out[:])
	var ram_data Model_Ram
	err = json.Unmarshal([]byte(texto), &ram_data)
	if err != nil{
		log.Fatal(err)
	}
	// obtener la memoria cache
	cmdd:= exec.Command("sh", "-c", "free -m | head -2 | tail -1 | awk '{print $6}'")
	ou, er := cmdd.CombinedOutput()
	var cache float64
	if er != nil{
		cache = 3000
	}else{
		num := len(ou)
		memoria := string(ou[:num-1]) // para quitar salto de linea
		tot, _ := strconv.Atoi(memoria)
		cache = float64(tot)
		//fmt.Println(total_ram)
	}
	ram_data.Cache = cache


	w.Header().Set("Content-Type", "application/json")
	enableCors(&w)
	json.NewEncoder(w).Encode(ram_data)
	//jsonEnviar, _ := json.Marshal(ram_data)
	//req, err := http.NewRequest()
}


// endpoint para leer el archivo del cpu
func getCpuData(w http.ResponseWriter, r *http.Request){
	//fmt.Println("Entra a /getCpu")
	out, err := ioutil.ReadFile("/proc/cpu_201801677")
	if err!=nil{
		log.Fatal(err)
	}
	texto := string(out[:])
	var procesos []Model_Cpu
	err = json.Unmarshal([]byte(texto), &procesos)
	if err != nil{
		log.Fatal(err)
	}
	
	// obtener la ram del sistema para calcular el porcentaje para cada proceso
	cmdd:= exec.Command("sh", "-c", "free -m | head -2 | tail -1 | awk '{print $2}'")
	ou, er := cmdd.CombinedOutput()
	var total_ram float64
	if er != nil{
		//total_ram = 1
		total_ram = 11847
	}else{
		num := len(ou)
		memoria := string(ou[:num-1]) // para quitar salto de linea
		tot, _ := strconv.Atoi(memoria)
		total_ram = float64(tot)
		//fmt.Println(total_ram)
	}

	// recorrer la lista para contar los estados de los procesos
	var contRunning, contSleeping, contStopped, contZombie, total, desconocido, uninterruptible int;
	var usuarios []User

	for i := 0; i < len(procesos); i++ {
		if(procesos[i].State == 0){
			contRunning+=1
		}else if(procesos[i].State == 8){
			contStopped+=1
		}else if(procesos[i].State == 1 || procesos[i].State == 1096){
			contSleeping+=1
		}else if(procesos[i].State == 4){
			contZombie+=1
		}else if(procesos[i].State == 2){
			uninterruptible+=1
		}else{
			desconocido+=1
		}
		total+=1
		procesos[i].Ram = ((procesos[i].Ram/(1024*1024))/total_ram)*100
		usr_id := procesos[i].Userid
		var nombre_usuario string

		if len(usuarios)<1{
			cmd:= exec.Command("sh", "-c", "getent passwd "+ strconv.Itoa(usr_id) +" | cut -d: -f1")
			out2, errr := cmd.CombinedOutput()
			//fmt.Println(out2)
			if errr != nil{
				nombre_usuario = "unknow"
			}else{
				num := len(out2)
				nombre_usuario = string(out2[:num-1])
			}

			usr := User{nombre_usuario, usr_id}
			usuarios = append(usuarios, usr)
			procesos[i].User = nombre_usuario

		}else{
			// primero recorrer el arreglo para ver a que valor pertenece el usuario
			bandera := false
			for y:=0; y<len(usuarios); y++ {
				if(usuarios[y].Uid == usr_id){
					procesos[i].User = usuarios[y].Name
					bandera = true
					break
				}
			}
			// no existe 
			if bandera {
				continue
			}
			cmd:= exec.Command("sh", "-c", "getent passwd "+ strconv.Itoa(usr_id) +" | cut -d: -f1")
			out2, errr := cmd.CombinedOutput()
			if errr != nil{
				nombre_usuario = "unknow"
			}else{
				num := len(out2)
				nombre_usuario = string(out2[:num-1])
			}

			usr := User{nombre_usuario, usr_id}
			usuarios = append(usuarios, usr)
			procesos[i].User = nombre_usuario
		}
	}
	status := 200
	data_cpu := Send_Cpu{contRunning, contStopped, contSleeping, uninterruptible, contZombie, desconocido, total, procesos, status}

	w.Header().Set("Content-Type", "application/json")
	enableCors(&w)
	json.NewEncoder(w).Encode(data_cpu)
	//fmt.Fprintf(w, texto)
}

// eliminar un proceso
func killProcess(w http.ResponseWriter, r *http.Request){
	//kill <pid>
	w.Header().Set("Content-Type", "application/json")
	enableCors(&w)
	var body Kill
	var estado Status

	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil{
		log.Println("Error en body")
		estado.Status="400"
	}else{
		errr := json.Unmarshal(b, &body)
		if errr!=nil{
			log.Println("Error en unmarshal", errr)
			estado.Status="400"
		}else{
			//fmt.Println(body.Pid);
			if body.Pid==0{
				fmt.Println("process 0, no se puede eliminar")
				return
			}
			cmd:= exec.Command("sh", "-c", "kill "+strconv.Itoa(body.Pid) )
			out2, er := cmd.CombinedOutput()
			
			if er != nil{
				//enviar codigo 400
				estado.Status = "400"
				log.Println(string(out2))
			}else{
				estado.Status = "200"
			}
		
			// si se ejecuto correctamente
		}
	}
	json.NewEncoder(w).Encode(estado)	
}

// endpoints a consumir
func setupRoutes(){
	http.HandleFunc("/", home)
	http.HandleFunc("/getRam", getRamData)
	http.HandleFunc("/getCpu", getCpuData)
	http.HandleFunc("/killProcess", killProcess)
	//http.HandleFunc("/echo", echo)
}

// cors
func enableCors(w *http.ResponseWriter){
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Headers", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
}

func main()  {
	fmt.Println("Levantando servidor...")
	setupRoutes()
	fmt.Println("Servidor listo en el puerto 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}