package database

import (
	"database/sql"
	"log"
	"os"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var DB *sql.DB


func Connect() {
	err := godotenv.Load()
	if err != nil{
		log.Fatalln("error loading .env file")
		log.Fatalln(err)
	}
	folderPath := "."

	// Membaca isi direktori
	files, err := os.ReadDir(folderPath)
	if err != nil {
		fmt.Printf("Gagal membaca folder: %v\n", err)
		return
	}

	fmt.Printf("Isi dari folder '%s':\n", folderPath)
	fmt.Println("-----------------------------------------")

	// Melakukan perulangan untuk menampilkan setiap item
	for _, file := range files {
		// Menentukan jenis (Apakah folder atau file biasa)
		if file.Name() == ".env"{
			fmt.Println(".env ada")
		}
	}
	

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	password := os.Getenv("DB_PASSWORD")
	user := os.Getenv("DB_USER")
	database := os.Getenv("DB_DATABASE")
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		user,
		password,
		host,
		port,
		database,
	)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	DB = db
	log.Println("database connected")
}
