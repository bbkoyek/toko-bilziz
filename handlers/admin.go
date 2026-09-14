package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"fmt"

	"bilziz/database"
	"bilziz/utils"

	"golang.org/x/crypto/bcrypt"
)


type LoginRequest struct{
	Username string `json:"username"`
	Password string `json:"password"`
}


func AdminHandler(w http.ResponseWriter,r *http.Request){
	fmt.Println("login handler")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method != "POST"{
		http.Error(w,"method tidak sesuai",400)
		return
	}
	
	
	var req LoginRequest
	
	json.NewDecoder(r.Body).Decode(&req)


	var username string
	var passwordHash string


	err := database.DB.QueryRow(
		"SELECT username,password FROM admin WHERE username=?",
		req.Username,
	).Scan(
		&username,
		&passwordHash,
	)


	if err != nil{
		http.Error(w,"login gagal sql",401)
		return
	}


	err = bcrypt.CompareHashAndPassword(
		[]byte(passwordHash),
		[]byte(req.Password),
	)


	if err != nil{
		http.Error(w,"login gagal jwt",401)
		log.Println(err)
		return
	}


	token,err := utils.GenerateToken(username)

	if err != nil{
		http.Error(w,"error token",500)
		return
	}


	json.NewEncoder(w).Encode(map[string]string{
		"token":token,
	})
}