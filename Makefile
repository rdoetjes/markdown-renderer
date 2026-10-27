
.PHONY: all build clean jail

all: build

build:
	GOOS=js GOARCH=wasm go build -o main.wasm main.go

run: build
	# Basic local serve using python for testing
	python3 -m http.server 8080

# Define the map of Jail ID to their ZFS/filesystem path
JAIL_PATH_100 = /zroot/sylve/jails/100

jail:
	@if [ -z "$(JAIL_ID)" ]; then \
		echo "Usage: sudo make jail JAIL_ID=<jail_id>"; \
		exit 1; \
	fi
	@JAIL_ROOT=$$(jls -j $(JAIL_ID) path); \
	DEST_DIR="$$JAIL_ROOT/usr/local/www/content_renderer"; \
	echo "Installing to jail $(JAIL_ID) (Root: $$JAIL_ROOT) at $$DEST_DIR"; \
	mkdir -p $$DEST_DIR; \
	cp index.html main.wasm wasm_exec.js style.css script.js $$DEST_DIR/; \
	echo "Successfully installed files to $$DEST_DIR"
