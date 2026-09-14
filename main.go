package main

import (
	"bilziz/database"
	"bilziz/handlers"
	"bilziz/middlowere"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	database.Connect()
	mux.Handle(
		"/upload/",
		http.StripPrefix(
			"/upload/",
			http.FileServer(http.Dir("./upload")),
		),
	)
	mux.HandleFunc("/toko/admin", middleware.JWT(handlers.Admin))
	mux.HandleFunc("/toko/login", handlers.AdminHandler)
	mux.HandleFunc("/toko", handlers.GetData)
	mux.HandleFunc("/toko/search", handlers.Searchdata)

	http.ListenAndServe(":2000",middleware.CORS(mux))
}
