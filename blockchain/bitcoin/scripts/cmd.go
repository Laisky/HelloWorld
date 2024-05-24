package main

import (
	gcmd "github.com/Laisky/go-utils/v4/cmd"
	"github.com/spf13/cobra"
)

func init() {
	rootCMD.PersistentFlags().Bool("debug", false, "run in debug mode")

	rootCMD.AddCommand(genPrivkeyCMD)
}

var rootCMD = &cobra.Command{
	Use:   "",
	Short: "scripts",
	Args:  gcmd.NoExtraArgs,
	Run: func(cmd *cobra.Command, args []string) {

	},
}

func main() {
	rootCMD.Execute()
}
