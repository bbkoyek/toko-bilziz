package models

type Products struct{
	Name *string `json:"name"`
	Deskripsi *string `json:"Deskripsi"`
	Harga *float64 `json:"harga"`
}

type ProductGet struct{
	Id *int
	Name *string `json:"name"`
	Deskripsi *string `json:"deskripsi"`
	Harga *float64 `json:"harga"`
	Image []string `json:"image"`
}