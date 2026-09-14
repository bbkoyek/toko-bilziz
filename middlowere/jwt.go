package middleware


import (
	"net/http"
	"strings"

	"bilziz/utils"

	"github.com/golang-jwt/jwt/v5"
)

func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

	allowedOrigins := map[string]bool{
    "http://127.0.0.1:5500": true,
    "https://kfw3bfr4-5500.asse.devtunnels.ms": true,
	}
	origin := r.Header.Get("Origin")
	if allowedOrigins[origin]{
		w.Header().Set("Access-Control-Allow-Origin", origin)
	}
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func JWT(next http.HandlerFunc) http.HandlerFunc{

	return func(w http.ResponseWriter,r *http.Request){

		auth := r.Header.Get("Authorization")


		if auth == ""{
			http.Error(w,"token tidak ada",401)
			return
		}


		tokenString := strings.Replace(
			auth,
			"Bearer ",
			"",
			1,
		)


		token,err := jwt.Parse(
			tokenString,
			func(token *jwt.Token)(interface{},error){

				return utils.SecretKey,nil
			},
		)


		if err != nil || !token.Valid{
			http.Error(w,"token invalid",401)
			return
		}


		next(w,r)
	}
}