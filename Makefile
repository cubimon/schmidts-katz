fontawesome_path = node_modules/@fortawesome/fontawesome-free
target_location = icons/fontawesome
prepare:
	cp $(fontawesome_path)/css/all.min.css             $(target_location)/css/
	cp $(fontawesome_path)/webfonts/fa-solid-900.ttf   $(target_location)/webfonts/
	cp $(fontawesome_path)/webfonts/fa-solid-900.woff2 $(target_location)/webfonts/
	cp $(fontawesome_path)/webfonts/fa-solid-900.woff  $(target_location)/webfonts/
