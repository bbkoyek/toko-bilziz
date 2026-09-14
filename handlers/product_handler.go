package handlers

import (
	"bilziz/helpers"
	"bilziz/services"
	"database/sql"
	"fmt"
	"net/http"
	"log"
)

func CreateProduct(w http.ResponseWriter,r *http.Request){
	gambar := r.FormValue("images")
	fmt.Println(gambar)
	product,err := services.GetFormData(r)
	if err != nil{
		helpers.ResponseError(w,err.Error(),http.StatusBadRequest)
		return
	}
	err = services.CreateProduct(product,r,w)
	if err != nil{
		helpers.ResponseError(w,err.Error(),http.StatusBadRequest)
		return
	}
	helpers.ResponseSuccess(w,"nil","berhasil create data",http.StatusOK)
}

func GetData(w http.ResponseWriter,r *http.Request){
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == "OPTIONS" {
		return
	}
	data,err := services.GetData()
	if err != nil{
		helpers.ResponseError(w,"kesalahan server",http.StatusInternalServerError)
		return
	}
	if err == sql.ErrNoRows{
		helpers.ResponseError(w,"data kosong",http.StatusOK)
	}
	helpers.ResponseSuccess(w,data,"berhasil ambil data",http.StatusOK)
}

func UpdateData(w http.ResponseWriter,r *http.Request){
	data,err := services.GetFormData(r)
	if err != nil{
		fmt.Println(err)
		helpers.ResponseError(w,"internal server error",http.StatusInternalServerError)
		return
	}
	err = services.EditData(data,r)
	if err != nil{
		fmt.Println(err)
		helpers.ResponseError(w,"internal server error",http.StatusInternalServerError)
		return
	}
	helpers.ResponseSuccess(w,nil,"berhasil update",http.StatusOK)
}

func Delete(w http.ResponseWriter,r *http.Request){
	id := r.FormValue("id")
	err := services.Delete_data(id)
	if err != nil{
		helpers.ResponseError(w,"internal server error",http.StatusInternalServerError)
		return
	}
	helpers.ResponseSuccess(w,nil,"data berhasil di hapus",http.StatusOK)
}

func Searchdata(w http.ResponseWriter,r *http.Request){
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == "OPTIONS" {
		return
	}
	key := r.URL.Query().Get("key")
	data,err := services.Search(key)
	if err != nil{
		log.Println(err)
		helpers.ResponseError(w,"internal server error",http.StatusInternalServerError)
		return
	}
	helpers.ResponseSuccess(w,data,"data di temukan",http.StatusOK)
}

func Admin(w http.ResponseWriter,r *http.Request){
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == "OPTIONS" {
		return
	}
	switch r.Method {
	case http.MethodPost:
		CreateProduct(w,r)
	case http.MethodGet:
		GetData(w,r)
	case http.MethodPut:
		UpdateData(w,r)
	case http.MethodDelete:
		Delete(w,r)
	default:
		helpers.ResponseError(w,"method not allowed",http.StatusMethodNotAllowed)
		return
	}
}