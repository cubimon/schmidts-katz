fontawesome_npm_path := node_modules/@fortawesome/fontawesome-free
fontawesome_target_path := icons/fontawesome
native_script_path := $(shell pwd)

prepare:
	mkdir -p $(fontawesome_target_path)/css/
	mkdir -p $(fontawesome_target_path)/webfonts/
	cp $(fontawesome_npm_path)/css/all.min.css             $(fontawesome_target_path)/css/
	cp $(fontawesome_npm_path)/webfonts/fa-solid-900.ttf   $(fontawesome_target_path)/webfonts/
	cp $(fontawesome_npm_path)/webfonts/fa-solid-900.woff2 $(fontawesome_target_path)/webfonts/
	cp $(fontawesome_npm_path)/webfonts/fa-solid-900.woff  $(fontawesome_target_path)/webfonts/

mpris:
	sed 's#\$${path}#'"${native_script_path}"'#g' mpris.json > mpris-new.json
	mkdir -p ~/.mozilla/native-messaging-hosts
	mv mpris-new.json ~/.mozilla/native-messaging-hosts/mpris.json

zip:
	zip release.zip manifest.json *.js controller/*.js patches/*.js popup/* icons/icon128.png icons/fontawesome/css/* icons/fontawesome/webfonts/*

