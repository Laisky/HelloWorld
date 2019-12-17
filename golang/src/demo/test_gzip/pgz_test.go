package test

import (
	"bytes"
	"compress/gzip"
	"github.com/klauspost/pgzip"
	"io/ioutil"
	"os"
	"testing"

	"github.com/Laisky/go-utils"
)

/*
goos: darwin
goarch: amd64
pkg: github.com/Laisky/HelloWorld/golang/src/demo/test_gzip
BenchmarkGZCompressor/gz_write_1kB-4         	   10000	    225748 ns/op	       0 B/op	       0 allocs/op
BenchmarkGZCompressor/gz_write_10kB-4        	    2613	   1014270 ns/op	       0 B/op	       0 allocs/op
BenchmarkGZCompressor/gz_write_50kB-4        	     364	   4494456 ns/op	       1 B/op	       0 allocs/op
BenchmarkGZCompressor/gz_write_100kB-4       	     231	   6200921 ns/op	       1 B/op	       0 allocs/op
BenchmarkGZCompressor/normal_write_1KB-4     	29948092	        52.4 ns/op	       0 B/op	       0 allocs/op
BenchmarkGZCompressor/normal_write_10KB-4    	 4443848	       233 ns/op	       0 B/op	       0 allocs/op
BenchmarkGZCompressor/normal_write_50KB-4    	  470455	      3163 ns/op	       0 B/op	       0 allocs/op
BenchmarkGZCompressor/normal_write_100KB-4   	  186914	      7632 ns/op	       0 B/op	       0 allocs/op
BenchmarkGZCompressor/gz_write_50kB_best_compression-4         	     603	   3108414 ns/op	       0 B/op	       0 allocs/op
BenchmarkGZCompressor/gz_write_50kB_best_speed-4               	    3037	    520604 ns/op	       0 B/op	       0 allocs/op
BenchmarkGZCompressor/gz_write_50kB_HuffmanOnly-4              	    3652	    323248 ns/op	       0 B/op	       0 allocs/op
BenchmarkGZCompressor/normal_write_50KB_to_file-4              	   10000	    102742 ns/op	       0 B/op	       0 allocs/op
BenchmarkGZCompressor/gz_write_50KB_to_file-4                  	     175	   6240226 ns/op	       2 B/op	       0 allocs/op
BenchmarkGZCompressor/gz_write_50KB_to_file_best_speed-4       	    2668	    585101 ns/op	   95866 B/op	       0 allocs/op
BenchmarkGZCompressor/gz_write_50KB_to_file_BestCompression-4  	     417	   4713929 ns/op	  633083 B/op	       0 allocs/op
PASS
ok  	github.com/Laisky/HelloWorld/golang/src/demo/test_gzip	27.592s
Success: Benchmarks passed.
*/
func BenchmarkGZCompressor(b *testing.B) {
	fp, err := ioutil.TempFile("", "gz-test")
	if err != nil {
		b.Fatalf("%+v", err)
	}
	defer fp.Close()
	defer os.Remove(fp.Name())
	b.Logf("create file name: %v", fp.Name())

	payload1K := []byte(utils.RandomStringWithLength(1024))
	payload10K := []byte(utils.RandomStringWithLength(10240))
	payload50K := []byte(utils.RandomStringWithLength(10240 * 5))
	payload100K := []byte(utils.RandomStringWithLength(102400))
	buf := &bytes.Buffer{}
	gzWriter := gzip.NewWriter(buf)
	b.Run("gz write 1kB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload1K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("gz write 10kB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload10K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("gz write 50kB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("gz write 100kB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload100K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("normal write 1KB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			buf.Write(payload1K)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("normal write 10KB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			buf.Write(payload10K)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("normal write 50KB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			buf.Write(payload50K)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("normal write 100KB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			buf.Write(payload100K)
			buf.Reset()
		}
	})
	if gzWriter, err = gzip.NewWriterLevel(buf, gzip.BestCompression); err != nil {
		b.Fatalf("got error: %+v", err)
	}
	b.Run("gz write 50kB best compression", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	if gzWriter, err = gzip.NewWriterLevel(buf, gzip.BestSpeed); err != nil {
		b.Fatalf("got error: %+v", err)
	}
	b.Run("gz write 50kB best speed", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	if gzWriter, err = gzip.NewWriterLevel(buf, gzip.HuffmanOnly); err != nil {
		b.Fatalf("got error: %+v", err)
	}
	b.Run("gz write 50kB HuffmanOnly", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()

	b.Run("normal write 50KB to file", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = fp.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
		}
	})
	if _, err = fp.Seek(0, 0); err != nil {
		b.Fatalf("seek: %+v", err)
	}

	gzWriter = gzip.NewWriter(fp)
	b.Run("gz write 50KB to file", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
		}
	})
	if _, err = fp.Seek(0, 0); err != nil {
		b.Fatalf("seek: %+v", err)
	}

	if gzWriter, err = gzip.NewWriterLevel(buf, gzip.BestSpeed); err != nil {
		b.Fatalf("got error: %+v", err)
	}
	b.Run("gz write 50KB to file best speed", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
		}
	})
	if _, err = fp.Seek(0, 0); err != nil {
		b.Fatalf("seek: %+v", err)
	}

	if gzWriter, err = gzip.NewWriterLevel(buf, gzip.BestCompression); err != nil {
		b.Fatalf("got error: %+v", err)
	}
	b.Run("gz write 50KB to file BestCompression", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
		}
	})
}

/*
goos: darwin
goarch: amd64
pkg: github.com/Laisky/HelloWorld/golang/src/demo/test_gzip
BenchmarkPGZCompressor/gz_write_1kB-4         	    7909	    142196 ns/op	  692997 B/op	      11 allocs/op
BenchmarkPGZCompressor/gz_write_10kB-4        	    8539	    151424 ns/op	  691951 B/op	      11 allocs/op
BenchmarkPGZCompressor/gz_write_50kB-4        	    6038	    178688 ns/op	  696439 B/op	      12 allocs/op
BenchmarkPGZCompressor/gz_write_100kB-4       	    5464	    214991 ns/op	  675344 B/op	      11 allocs/op
BenchmarkPGZCompressor/normal_write_1KB-4     	38609056	        31.7 ns/op	       0 B/op	       0 allocs/op
BenchmarkPGZCompressor/normal_write_10KB-4    	 8489320	       140 ns/op	       0 B/op	       0 allocs/op
BenchmarkPGZCompressor/normal_write_50KB-4    	  486973	      2410 ns/op	       0 B/op	       0 allocs/op
BenchmarkPGZCompressor/normal_write_100KB-4   	  263452	      4764 ns/op	       0 B/op	       0 allocs/op
BenchmarkPGZCompressor/gz_write_50kB_best_compression-4         	    1614	    737059 ns/op	  581633 B/op	      12 allocs/op
BenchmarkPGZCompressor/gz_write_50kB_best_speed-4               	    6607	    166990 ns/op	  659595 B/op	      12 allocs/op
BenchmarkPGZCompressor/gz_write_50kB_HuffmanOnly-4              	    2769	    420641 ns/op	  547038 B/op	      12 allocs/op
BenchmarkPGZCompressor/normal_write_50KB_to_file-4              	   14587	     85377 ns/op	       0 B/op	       0 allocs/op
BenchmarkPGZCompressor/gz_write_50KB_to_file-4                  	   19995	     87519 ns/op	   66030 B/op	       3 allocs/op
BenchmarkPGZCompressor/gz_write_50KB_to_file_best_speed-4       	   10000	    159127 ns/op	  199775 B/op	       3 allocs/op
BenchmarkPGZCompressor/gz_write_50KB_to_file_BestCompression-4  	    4347	    335686 ns/op	   55145 B/op	       3 allocs/op
PASS
ok  	github.com/Laisky/HelloWorld/golang/src/demo/test_gzip	22.745s
Success: Benchmarks passed.

*/
func BenchmarkPGZCompressor(b *testing.B) {
	fp, err := ioutil.TempFile("", "gz-test")
	if err != nil {
		b.Fatalf("%+v", err)
	}
	defer fp.Close()
	defer os.Remove(fp.Name())
	b.Logf("create file name: %v", fp.Name())

	payload1K := []byte(utils.RandomStringWithLength(1024))
	payload10K := []byte(utils.RandomStringWithLength(10240))
	payload50K := []byte(utils.RandomStringWithLength(10240 * 5))
	payload100K := []byte(utils.RandomStringWithLength(102400))
	buf := &bytes.Buffer{}

	gzWriter := pgzip.NewWriter(buf)
	gzWriter.SetConcurrency(100000, 4)
	// gzWriter := gzip.NewWriter(buf)
	b.Run("gz write 1kB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload1K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("gz write 10kB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload10K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("gz write 50kB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("gz write 100kB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload100K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("normal write 1KB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			buf.Write(payload1K)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("normal write 10KB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			buf.Write(payload10K)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("normal write 50KB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			buf.Write(payload50K)
			buf.Reset()
		}
	})
	buf.Reset()
	b.Run("normal write 100KB", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			buf.Write(payload100K)
			buf.Reset()
		}
	})
	if gzWriter, err = pgzip.NewWriterLevel(buf, pgzip.BestCompression); err != nil {
		b.Fatalf("got error: %+v", err)
	}
	gzWriter.SetConcurrency(100000, 4)
	b.Run("gz write 50kB best compression", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	if gzWriter, err = pgzip.NewWriterLevel(buf, pgzip.BestSpeed); err != nil {
		b.Fatalf("got error: %+v", err)
	}
	gzWriter.SetConcurrency(100000, 4)
	b.Run("gz write 50kB best speed", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()
	if gzWriter, err = pgzip.NewWriterLevel(buf, pgzip.HuffmanOnly); err != nil {
		b.Fatalf("got error: %+v", err)
	}
	gzWriter.SetConcurrency(100000, 4)
	b.Run("gz write 50kB HuffmanOnly", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
			if err = gzWriter.Close(); err != nil {
				b.Fatalf("close: %+v", err)
			}
			gzWriter.Reset(buf)
			buf.Reset()
		}
	})
	buf.Reset()

	b.Run("normal write 50KB to file", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = fp.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
		}
	})
	if _, err = fp.Seek(0, 0); err != nil {
		b.Fatalf("seek: %+v", err)
	}

	gzWriter = pgzip.NewWriter(fp)
	gzWriter.SetConcurrency(100000, 4)
	b.Run("gz write 50KB to file", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
		}
	})
	if _, err = fp.Seek(0, 0); err != nil {
		b.Fatalf("seek: %+v", err)
	}

	if gzWriter, err = pgzip.NewWriterLevel(buf, pgzip.BestSpeed); err != nil {
		b.Fatalf("got error: %+v", err)
	}
	gzWriter.SetConcurrency(100000, 4)
	b.Run("gz write 50KB to file best speed", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
		}
	})
	if _, err = fp.Seek(0, 0); err != nil {
		b.Fatalf("seek: %+v", err)
	}

	if gzWriter, err = pgzip.NewWriterLevel(buf, pgzip.BestCompression); err != nil {
		b.Fatalf("got error: %+v", err)
	}
	gzWriter.SetConcurrency(100000, 4)
	b.Run("gz write 50KB to file BestCompression", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = gzWriter.Write(payload50K); err != nil {
				b.Fatalf("write: %+v", err)
			}
		}
	})
}
