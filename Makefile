
.PHONY: all build clean jail

all: build

build:
	GOOS=js GOARCH=wasm go build -o main.wasm main.go

run: build
	# Basic local serve using python for testing
	python3 -m http.server 8080

jail:
	@if [ -z "$(JAIL_ID)" ]; then \
		echo "Usage: sudo make jail JAIL_ID=<jail_number>"; \
		exit 1; \
	fi
	@DEST_DIR="/usr/local/www/content_renderer"; \
	echo "Installing to jail $(JAIL_ID) at $$DEST_DIR"; \
	jexec $(JAIL_ID) mkdir -p $$DEST_DIR; \
	jexec $(JAIL_ID) rm -rf $$DEST_DIR/*; \
	cp index.html main.wasm wasm_exec.js style.css $(DEST_DIR_PATH_INSIDE_JAIL_IF_NEEDED) $$DEST_DIR/; \
	# Note: This cp assumes you are running from the host and the path is accessible.
