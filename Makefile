fontawesome_path := node_modules/@fortawesome/fontawesome-free
target_location := icons/fontawesome

prepare:
	mkdir -p $(target_location)/css/
	mkdir -p $(target_location)/webfonts/
	cp $(fontawesome_path)/css/all.min.css             $(target_location)/css/
	cp $(fontawesome_path)/webfonts/fa-solid-900.ttf   $(target_location)/webfonts/
	cp $(fontawesome_path)/webfonts/fa-solid-900.woff2 $(target_location)/webfonts/
	cp $(fontawesome_path)/webfonts/fa-solid-900.woff  $(target_location)/webfonts/

mpris:
	sed 's#\$${path}#'"$(pwd)"'#g' mpris.json > mpris-new.json
	mkdir -p ~/.mozilla/native-messaging-hosts
	mv mpris-new.json ~/.mozilla/native-messaging-hosts/mpris.json

zip:
	zip release.zip manifest.json *.js controller/*.js patches/*.js popup/* icons/icon128.png icons/fontawesome/css/* icons/fontawesome/webfonts/*

