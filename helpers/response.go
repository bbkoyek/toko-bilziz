package helpers

import (
	"encoding/json"
	"net/http"
)

func ResponseSuccess(w http.ResponseWriter,data interface{},message string,code int){
	w.Header().Set("Content-Type","application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":"success",
		"message":message,
		"data":data,
	})
}
func ResponseError(w http.ResponseWriter,message string,code int){
	w.Header().Set("Content-Type","application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":"error",
		"message":message,
	})
}