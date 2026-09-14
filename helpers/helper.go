package helpers

import (
	"crypto/rand"
	"fmt"
	"image"
	"math/big"
	"os"
	"path"

	"github.com/chai2010/webp"
)

const charlist = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

func GenerateRand(max int)(string) {
	result := make([]byte, max)
	for n := range result {
		i, _ := rand.Int(rand.Reader,big.NewInt(int64(len(charlist))))
		result[n]=charlist[i.Int64()]
	}
	return string(result)
}

func CreateImg(folder string,name string,img image.Image)(error){
	data,err := webp.EncodeRGB(img,80)
	if err != nil{
		return err
	}
	path := fmt.Sprintf("./upload/%s/%s.webp",folder,name)
	err = os.WriteFile(path,data,0664)
	if err != nil{
		return err
	}
	return nil
}

func CekFolder()(error){
	pathRoot := "upload"
	subFolder := []string{"medium","original","thumnail"}
	for _,sub := range subFolder{
		targetPath := path.Join(pathRoot,sub)
		if _,err := os.Stat(targetPath);os.IsNotExist(err){
			err := os.MkdirAll(targetPath,os.ModePerm)
			if err != nil{
				return err
			}
			return nil
		}else{
			return nil
		}
	}
	return nil
}