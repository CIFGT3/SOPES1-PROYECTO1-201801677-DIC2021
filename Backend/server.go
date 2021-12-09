package main

import(
	"fmt"
	"log"
	"net/http"
	//"os/exec"
	"io/ioutil" 
	"encoding/json"
)

type Model_Ram struct {
	Totalram uint16 	`json:"totalram"`
	Freeram uint16 		`json:"freeram"`
	Sharedram uint16 	`json:"sharedram"`
	Bufferram uint16	`json:"bufferram"`
	Totalswap uint16	`json:"totalswap"`
	Freeswap uint16		`json:"freeswap"`
	Totalhigh uint16	`json:"totalhigh"`
	Freehigh uint16		`json:"freehigh"`
	Memunit	uint16		`json:"memunit"`
}

type Model_Cpu struct {
	State	int		`json:"state"`
	Process string 	`json:"process"`
	Pid 	int		`json:"pid"`
	Userid	int 	`json:"userid"`
	Hijos []Children_Process `json:"hijos"`
}

type Children_Process struct{
	Process string 	`json:"process"`
	Pid		int 	`json:"pid"`
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
	//fmt.Printf("%+v\n", ram_data)
	json.NewEncoder(w).Encode(ram_data)
	//fmt.Fprintf(w, texto)
}


// endopoint para leer el archivo del cpu
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
	json.NewEncoder(w).Encode(procesos)
	//fmt.Fprintf(w, texto)
}

// endpoints a consumir
func setupRoutes(){
	http.HandleFunc("/", home)
	http.HandleFunc("/getRam", getRamData)
	http.HandleFunc("/getCpu", getCpuData)
}


func main()  {
	fmt.Println("Levantando servidor...")
	setupRoutes()
	fmt.Println("Servidor listo en el puerto 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}