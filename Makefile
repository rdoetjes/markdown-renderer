
.PHONY: all build clean jail

all: build

build:
	GOOS=js GOARCH=wasm go build -o main.wasm main.go

run: build
	# Basic local serve using python for testing
	python3 -m http.server 8080

jail:
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "Usage: sudo make jail <jail_number>"; \
		exit 1; \
	fi
	@JAIL_ID=$(filter-out $@,$(MAKECMDGOALS)); \
	DEST_DIR="/usr/local/www/content_renderer"; \
	echo "Installing to jail $$JAIL_ID at $$DEST_DIR"; \
	jexec $$JAIL_ID mkdir -p $$DEST_DIR; \
	jexec $$JAIL_ID rm -rf $$DEST_DIR/*; \
	cp index.html main.wasm wasm_exec.js style.css $$DEST_DIR/; \
	# Assuming file structure in host is same as jail via nullfs or copy
	# For now, copying from local folder. 

# Handle argument
%:
	@:
