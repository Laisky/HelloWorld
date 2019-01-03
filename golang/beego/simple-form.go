package main

import (
	"bytes"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/validation"
)

type MainController struct {
	beego.Controller
}

type user struct {
	Username string `form:"username"`
	Password int    `form:"password"`
}

type resp struct {
	Status  string
	Message string
}

func (this *MainController) Post() {
	beego.Informational("POST MainController")

	u := user{}
	if err := this.ParseForm(&u); err != nil {
		this.Abort("403")
	}

	valid := validation.Validation{}
	valid.Required(u.Username, "name")
	valid.Required(u.Password, "password")
	if valid.HasErrors() {
		// 如果有错误信息，证明验证没通过
		// 打印错误信息
		var message bytes.Buffer
		for _, err := range valid.Errors {
			message.WriteString(err.Key + ": " + err.Message + ";")
		}
		respJson := resp{Status: "fail", Message: message.String()}
		this.Data["json"] = respJson
		this.ServeJSON()
	}

	this.Ctx.SetCookie("username", u.Username)
	this.Ctx.WriteString("Ok")
}

func main() {
	beego.BConfig.Listen.Graceful = true
	beego.BConfig.Listen.HTTPAddr = "127.0.0.1"

	beego.Router("/", &MainController{})
	beego.Run()
}
