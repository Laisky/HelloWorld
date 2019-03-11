package main

import (
	"io/ioutil"
	"os"

	"github.com/Laisky/go-utils"
	"go.uber.org/zap"
)

//go:generate msgp

type DataV2 struct {
	Message map[string]interface{} `msg:"message"`
	Tag     string                 `msg:"tag"`
	Id      int64                  `msg:"id"`
	Exts    []int64                `msg:"exts"`
}

func main() {
	utils.SetupLogger("info")
	defer utils.Logger.Sync()

	// create data files
	dataFp1, err := ioutil.TempFile("", "msgp-test")
	if err != nil {
		utils.Logger.Panic("create file error", zap.Error(err))
	}
	defer dataFp1.Close()
	defer os.Remove(dataFp1.Name())
	utils.Logger.Info("create file", zap.String("fname", dataFp1.Name()))

	// marshal & unmarshal
	d1 := &DataV2{
		Message: map[string]interface{}{"a": 123},
		Tag:     "msg1",
		Id:      1,
	}
	d2 := &DataV2{
		Message: map[string]interface{}{"a": "abv"},
		Tag:     "msg2",
		Id:      2,
	}
	payload := []byte{}

	if payload, err = d1.MarshalMsg(payload); err != nil {
		utils.Logger.Panic("marshal got error", zap.Error(err))
	}
	utils.Logger.Info("marshal ok", zap.ByteString("payload", payload))

	if payload, err = d2.MarshalMsg(payload); err != nil {
		utils.Logger.Panic("marshal got error", zap.Error(err))
	}
	utils.Logger.Info("marshal ok", zap.ByteString("payload", payload))

}
