package main

import (
	log "github.com/cihub/seelog"
)

func set_log() error {
	logger, err := log.LoggerFromConfigAsFile("seelog.xml")

	if err != nil {
		return err
	}

	log.ReplaceLogger(logger)
	return err
}

func main() {
	defer log.Flush()

	set_log()

	log.Trace("trace: xxx")
	log.Debug("debug: xxx")
	log.Info("info: xxx")
	log.Warn("warn: xxx")
	log.Error("error: xxx")
	log.Critical("critical: xxx")
}
