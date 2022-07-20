# PyTorch and the pre-trained model must be installed on the system. See README for details.

ARCH_LIBDIR ?= /lib/$(shell $(CC) -dumpmachine)


ifeq ($(DEBUG),1)
GRAMINE_LOG_LEVEL = debug
else
GRAMINE_LOG_LEVEL = error
endif

.PHONY: all
all: python3.manifest
ifeq ($(SGX),1)
all: python3.manifest.sgx python3.sig python3.token
endif

python3.manifest: python3.manifest.template
	gramine-manifest \
		-Dlog_level=$(GRAMINE_LOG_LEVEL) \
		-Darch_libdir=$(ARCH_LIBDIR) \
		-Dentrypoint=$(realpath $(shell sh -c "command -v python3")) \
		$< > $@

# Make on Ubuntu <= 20.04 doesn't support "Rules with Grouped Targets" (`&:`),
# for details on this workaround see
# https://github.com/gramineproject/gramine/blob/e8735ea06c/CI-Examples/helloworld/Makefile
python3.manifest.sgx python3.sig: sgx_sign
	@:

.INTERMEDIATE: sgx_sign
sgx_sign: python3.manifest
	gramine-sgx-sign \
		-k private.key
		--manifest $< \
		--output $<.sgx

python3.token: python3.sig
	gramine-sgx-get-token --output $@ --sig $<

.PHONY: clean
clean:
	$(RM) *.token *.sig *.manifest.sgx *.manifest

.PHONY: distclean
distclean: clean
	$(RM) *.pt result.txt
