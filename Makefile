.PHONY: all publish clean watch

# non-versioned include
-include vars.mk

SRC := src
BUILD := dist
MKDIR = mkdir -p ${dir $@}

allwww := $(shell find $(SRC) -type f)
allsrc := main.js $(shell find plugins/)

all: $(BUILD)/index.html $(BUILD)/assets/andrew.stamp $(BUILD)/assets/zefram.stamp

$(BUILD)/index.html: $(allsrc) $(allwww) tailwind.config.js postcss.config.js
	@echo "url is $(URL)"
	SRC=$(SRC) DEST=$(BUILD) URL=$(URL) node main
	npx postcss $(BUILD)/css/**/*.css --base $(BUILD)/ --dir $(BUILD)/

# this is *required* as a build step because the public stamp file is parsed by frontmatter by metalsmith...
$(BUILD)/assets/%.stamp: $(SRC)/assets/%.stamp $(BUILD)/index.html
	@$(MKDIR)
	cp $< $@

clean:
	rm -rf $(BUILD)

watch: all
	while true; do inotifywait -qr -e close_write *.js $(SRC)/ plugins/; make; done

publish: override URL := ''
publish:
	@echo "Remember to commit your changes to master for publishing to work!"
	@sleep 5
	git checkout publish
	git merge master
	make clean all
	git add .
	git commit -m "build"
	git push
	git checkout -

