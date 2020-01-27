fontawesome_npm_path := node_modules/@fortawesome/fontawesome-free
fontawesome_target_path := icons/fontawesome
native_script_path := $(shell pwd)
mpris_manifest_path_firefox := ~/.mozilla/native-messaging-hosts
mpris_manifest_path_chrome := ~/.config/chromium/NativeMessagingHosts

prepare:
	mkdir -p $(fontawesome_target_path)/css/
	mkdir -p $(fontawesome_target_path)/webfonts/
	cp $(fontawesome_npm_path)/css/all.min.css             $(fontawesome_target_path)/css/
	cp $(fontawesome_npm_path)/webfonts/fa-solid-900.ttf   $(fontawesome_target_path)/webfonts/
	cp $(fontawesome_npm_path)/webfonts/fa-solid-900.woff2 $(fontawesome_target_path)/webfonts/
	cp $(fontawesome_npm_path)/webfonts/fa-solid-900.woff  $(fontawesome_target_path)/webfonts/

patch_firefox:
	find -name '*.js' -not -path "./node_modules/*" -exec sed -i 's/chrome\./browser./g' {} \;

patch_chrome:
	find -name '*.js' -not -path "./node_modules/*" -exec sed -i 's/browser\./chrome./g' {} \;

mpris-firefox:
	cp mpris.json mpris-firefox.json
	sed -i 's#\$${path}#'"${native_script_path}"'#g' mpris-firefox.json
	sed -i 's#\$${allowed_extension}#schmidts_katz@cubimon.org#g' mpris-firefox.json
	chmod 644 mpris-firefox.json
	mkdir -p ${mpris_manifest_path_firefox}
	mv mpris-firefox.json ${mpris_manifest_path_firefox}/schmidts_katz_mpris.json

mpris-chrome:
	cp mpris.json mpris-chrome.json
	sed -i 's#\$${path}#'"${native_script_path}"'#g' mpris-chrome.json
	sed -i 's#\$${allowed_extension}#chrome-extension://afjbcphlhomgmdfnhondkjglafgbejdm/#g' mpris-chrome.json
	sed -i 's/allowed_extensions/allowed_origins/g' mpris-chrome.json
	chmod 644 mpris-chrome.json
	mkdir -p ${mpris_manifest_path_chrome}
	mv mpris-chrome.json ${mpris_manifest_path_chrome}/schmidts_katz_mpris.json

zip:
	zip release.zip manifest.json *.js controller/*.js patches/*.js popup/* icons/icon128.png icons/fontawesome/css/* icons/fontawesome/webfonts/*
