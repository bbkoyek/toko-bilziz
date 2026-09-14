package services

import (
	"bilziz/helpers"
	"bilziz/models"
	"bilziz/repository"
	"errors"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"net/http"
	"strconv"

	"github.com/disintegration/imaging"
)

func CreateProduct(p models.Products,r *http.Request,w http.ResponseWriter) (error) {
	fields := []string{}
	values := []string{}
	arg := []interface{}{}
	if p.Name != nil && *p.Name != "" {
		fields = append(fields, "name")
		values = append(values, "?")
		arg = append(arg, *p.Name)
	}else{
		return errors.New("nama tidak boleh kosong")
	}
	if p.Deskripsi != nil && *p.Deskripsi != "" {
		fields = append(fields, "deskripsi")
		values = append(values, "?")
		arg = append(arg, *p.Deskripsi)
	}
	if p.Harga != nil && *p.Harga > 0 {
		fields = append(fields, "harga")
		values = append(values, "?")
		arg = append(arg, *p.Harga)
	}else{
		return errors.New("harga invalid")
	}
	result,err := repository.Insert(fields,values,arg)
	if err != nil{
		return err
	}
	id,_ := result.LastInsertId()
	SaveImg(id,r)
	return nil
}
func SaveImg(id int64, r *http.Request) (error){
	err := r.ParseMultipartForm(20 << 10)

	if err != nil {
		return errors.New("file tidak sesuai")
	}
	files := r.MultipartForm.File["images"]
	
	for _, fileheader := range files {
		name := helpers.GenerateRand(10)
		file, err := fileheader.Open()
		if err != nil {
			continue
		}
		img,_,err := image.Decode(file)
		if err != nil{
			return errors.New("Decode file gagal")
		}
		width := img.Bounds().Dx()
		hight := img.Bounds().Dy()

		//original
		original := img
		if width > 1600 || hight > 1600{
			original = imaging.Fit(img,1600,1600,imaging.Lanczos)
		}
		err = helpers.CreateImg("original",name,original)
		if err != nil{
			log.Println(err)
			return errors.New("gagal simpan gambar original")
		}

		//thumnel
		thumnail := img
		if width > 300 || hight > 300{
			thumnail = imaging.Fit(img,300,300,imaging.Lanczos)
		}
		err = helpers.CreateImg("thumnail",name,thumnail)
		if err != nil{
			log.Println(err)
			return errors.New("gagal simpan gambar thumnail")
		}
		
		//medium
		medium := img
		if width > 800 || hight > 800{
			medium = imaging.Fit(img,800,800,imaging.Lanczos)
		}
		err = helpers.CreateImg("medium",name,medium)
		if err != nil{
			log.Println(err)
			return errors.New("gagal simpan gambar medium")
		}
		// else{
		// 	data,err := webp.EncodeRGB(img,80)
		// 	if err != nil{
		// 		return errors.New("gagal convert webp")
		// 	}
		// 	err = os.WriteFile("./upload/medium/"+name+".webp",data,0644)
		// 	if err != nil{
		// 		return errors.New(err.Error())
		// 	}
		// }
		// name := helpers.GenerateRand(18)
		// filename := name + filepath.Ext(fileheader.Filename)
		// dst, err := os.Create("./upload/" + filename)
		// if err != nil {
		// 	continue
		// }
		// defer dst.Close()
		// io.Copy(dst, file)
		err = repository.CreateImages(id,name+".webp")
		if err != nil {
			continue
		}
	}
	return nil
}

func GetFormData(r *http.Request)(models.Products,error){
	var p models.Products
	name := r.FormValue("name")
	deskripsi := r.FormValue("deskripsi")
	harga,err := strconv.ParseFloat(r.FormValue("harga"),64)
	if err != nil || harga <=0{
		return models.Products{},errors.New("invalid harga")
	}else{
		p.Harga = &harga
	}
	if name == ""{
		return models.Products{},errors.New("nama harus di isi")
	}else{
		p.Name = &name
	}
	if deskripsi != ""{
		p.Deskripsi = &deskripsi
	}
	return p,nil
}

func GetData()([]models.ProductGet,error){
	data,err := repository.SelectAll()
	if err != nil{
		return []models.ProductGet{},err
	}
	return data,nil
}

func EditData(p models.Products,r *http.Request)(error){
	fields := []string{}
	arg := []interface{}{}
	if p.Name != nil && *p.Name != ""{
		fields = append(fields, "name = ?")
		arg = append(arg, *p.Name)
	}
	if p.Deskripsi != nil && *p.Deskripsi != ""{
		fields = append(fields, "deskripsi = ?")
		arg = append(arg, *p.Deskripsi)
	}
	if p.Harga != nil && *p.Harga >0{
		fields = append(fields, "harga = ?")
		arg = append(arg, *p.Harga)
	}
	id := r.FormValue("id")
	fmt.Println("id",id)
	idint,err := strconv.Atoi(id)
	if err != nil{
		return err
	}
	arg = append(arg, idint)
	err = repository.Update(fields,arg)
	if r.FormValue("delete_image") != ""{
		NameImage := r.FormValue("delete_image")
		fmt.Println(NameImage)
		err := repository.DelImage(NameImage)
		if err != nil{
			fmt.Println(err)
			return err
		}
	}else if r.MultipartForm.File["images"] != nil{
		fmt.Println("ikut jalan")
		err := SaveImg(int64(idint),r)
		if err != nil{
			return err
		}
	}
	return nil
}

func Delete_data(id string)(error){
	err := repository.Delete(id)
	if err != nil{
		return err
	}
	return nil
}

func Search(name string)([]models.ProductGet,error){
	data,err := repository.Search(name)
	if err != nil{
		return []models.ProductGet{},err
	}
	return data,nil
}