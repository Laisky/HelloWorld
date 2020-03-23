package test

import (
	"fmt"
	"io"
	"os"
)

func ReadLine(reader io.Reader) (line []byte, err error) {
	var p = []byte{0}
	for {
		_, err := reader.Read(p)
		if err == io.EOF {
			return line, err
		}
		if err != nil {
			return nil, err
		}
		if p[0] == '\n' {
			return line, nil
		}
		line = append(line, p[0])
	}
}

func TestBufio(t *testing.T) {
	inputFile, inputError := os.Open("data.txt")
	if inputError != nil {
		fmt.Printf("An error occurred on opening the inputfile\n" +
			"Does the file exist?\n" +
			"Have you got acces to it?\n")
		return // exit the function on error
	}
	defer inputFile.Close()

	// 用 bufio 封装 Reader
	// 会自动将数据读入缓存区，减少 IO 的使用
	inputReader := bufio.NewReader(inputFile)
	for {
		inputString, readerError := inputReader.ReadString('\n')
		if readerError == io.EOF {
			return
		}
		fmt.Printf("The input was: %s", inputString)
	}
}


func TestReader(t *testing.T) {
	inputFile, inputError := os.Open("data.txt")
	if inputError != nil {
		fmt.Printf("An error occurred on opening the inputfile\n" +
			"Does the file exist?\n" +
			"Have you got acces to it?\n")
		return // exit the function on error
	}
	defer inputFile.Close()

	reader := io.Reader(inputFile)
	for {
		line, err := ReadLine(reader)
		if err != nil {
			fmt.Println(err.Error())
			return
		} else {
			fmt.Println(string(line[:]))
		}
	}
}
