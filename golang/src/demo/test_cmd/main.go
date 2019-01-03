package dependencies

import (
	"bytes"
	"os"
	"os/exec"
	"time"

	"github.com/Laisky/go-utils"
	"go.uber.org/zap"
	"pateo.com/go-ramjet/tasks/store"
)

func runTask() {
	utils.Logger.Info("run zipkin-dependencies...")
	for env := range utils.Settings.Get("tasks.zipkin.dependencies.cmds").(map[string]interface{}) {
		name := utils.Settings.GetString("tasks.zipkin.dependencies.cmds." + env + ".name")
		args := utils.Settings.GetStringSlice("tasks.zipkin.dependencies.cmds." + env + ".args")

		var stderr bytes.Buffer
		cli := exec.Command(name, args...)
		cli.Env = os.Environ()
		cli.Stderr = &stderr
		out, err := cli.Output()
		if err != nil {
			utils.Logger.Error("try to run cmd got error",
				zap.String("name", name),
				zap.Strings("args", args),
				zap.String("err", stderr.String()),
				zap.Error(err))
			continue
		}

		utils.Logger.Debug("run cmd done",
			zap.String("name", name),
			zap.Strings("args", args),
			zap.ByteString("output", out))
	}

	utils.Logger.Info("zipkin-dependencies done")
}

func BindTask() {
	utils.Logger.Info("bind zipkin-dependencies task...")
	go store.TickerAfterRun(utils.Settings.GetDuration("tasks.zipkin.dependencies.interval")*time.Second, runTask)
}
