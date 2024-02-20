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

# this is *required* as a build step because the public stamp file is parsed as frontmatter by metalsmith
# # and we end up with blank .stamp files in the build dir
$(BUILD)/assets/%.stamp: $(SRC)/assets/%.stamp $(BUILD)/index.html
	@$(MKDIR)
	cp $< $@

clean:
	rm -rf $(BUILD)

watch: all
	while true; do inotifywait -qr -e close_write *.js $(SRC)/ plugins/; make; done

