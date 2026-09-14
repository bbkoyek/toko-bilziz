package repository

import (
	"bilziz/database"
	"bilziz/models"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"strings"
)

func Insert(fields []string,values []string,arg []interface{})(sql.Result,error){
	query := "INSERT INTO product ("+strings.Join(fields, ",")+") VALUES ("+strings.Join(values, ",")+")"
	result,err := database.DB.Exec(query,arg...)
	if err != nil{
		log.Println(err)
		return nil,err
	}
	return result,nil
}

func SelectAll()([]models.ProductGet,error){
	query := `
	SELECT 
		p.id,
		p.name,
		p.deskripsi,
		p.harga,
		pi.url_img
	FROM product p
	LEFT JOIN product_img pi
		ON p.id = pi.product_id
	ORDER BY p.id
	`
	row,err := database.DB.Query(query)
	if err != nil{
		return []models.ProductGet{},err
	}
	product := map[int]*models.ProductGet{}
	for row.Next(){
		var(
			id int
			img sql.NullString
			p models.ProductGet
		)
		err = row.Scan(
			&id,
			&p.Name,
			&p.Deskripsi,
			&p.Harga,
			&img,
		)
		if err != nil{
			return []models.ProductGet{},err
		}
		tempID := id
		if product[tempID] == nil{
			product[tempID] = &models.ProductGet{
				Id:&tempID,
				Name: p.Name,
				Deskripsi: p.Deskripsi,
				Harga: p.Harga,
				Image: []string{},
			}
		}
		if img.Valid{
			product[tempID].Image = append(product[tempID].Image, img.String)
		}
	}
	var result []models.ProductGet
	for _,p:= range product{
		result = append(result, *p)
	}
	return result,nil
}

func DelImage(name string)(error){
	fmt.Print("func del is run")
	query := "DELETE FROM product_img WHERE url_img = ?"
	tx,err := database.DB.Begin()
	if err != nil{
		return err
	}
	result,err := tx.Exec(query,name)
	efect,err := result.RowsAffected()
	if efect <= 0{
		fmt.Println("tidak ada yang berubah")
		return errors.New("tidak ada yang berubah")
	}
	fmt.Print("func del is run")
	tx.Commit()
	return nil
}

func CreateImages(id int64,filename string)(error){
	query := "INSERT INTO product_img (product_id,url_img) VALUES (?,?)"
	_,err := database.DB.Exec(query, id, filename)
	if err != nil{
		return err
	}
	return nil
}

func Delete(id string)(error){
	query := "DELETE FROM product WHERE id = ?"
	result,err := database.DB.Exec(query,id)
	if err != nil{
		return err
	}
	row,err := result.RowsAffected()
	if err != nil{
		return err
	}
	if row <=0 {
		return errors.New("tidak ada data yang di hapus")
	}
	return nil
}

func Search(name string)([]models.ProductGet,error){
	query := `
	SELECT p.id,p.name,p.deskripsi,p.harga,i.url_img
	FROM product p
	LEFT JOIN product_img i ON p.id = i.product_id WHERE p.name LIKE ?
	`
	key := "%"+name+"%"
	row,err := database.DB.Query(query,key)
	if err != nil{
		return []models.ProductGet{},err
	}
	product := map[int]*models.ProductGet{}
	defer row.Close()
	for row.Next(){
		var(
			id int
			img sql.NullString
			p models.ProductGet
			
		)
		row.Scan(
			&id,
			&p.Name,
			&p.Deskripsi,
			&p.Harga,
			&img,
		)
		tempID := id
		if product[tempID] == nil{
			product[tempID] = &models.ProductGet{
				Id:&tempID,
				Name: p.Name,
				Deskripsi: p.Deskripsi,
				Harga: p.Harga,
				Image: []string{},
			}
		}
		if img.Valid{
			product[tempID].Image = append(product[tempID].Image, img.String)
		}
	}
	data := []models.ProductGet{}
	for _,p := range product{
		data = append(data, *p)
	}
	return data,nil
}

func Update(fields []string,arg []interface{})(error){
	query := "UPDATE product SET "+strings.Join(fields, ",")
	query += " WHERE id = ?"
	result,err := database.DB.Exec(query,arg...)
	if err != nil{
		return err
	}
	efect,err := result.RowsAffected()
	if err != nil{
		return err
	}
	if efect <= 0 {
		return errors.New("update not efect")
	}
	return nil
}