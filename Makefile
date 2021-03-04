.PHONY: all build watch clean

export SHELL := /bin/bash
export NODE_ENV ?= production

DEST ?= docs
DRAFTS ?= --drafts

all: build

build:
	bundle exec jekyll build $(DRAFTS) -d $(DEST) --config _config.yml,_config.local.yml

watch:
	bundle exec jekyll build $(DRAFTS) -d $(DEST) --config _config.yml,_config.local.yml --watch

deploy: DRAFTS :=
deploy: all

clean:
	rm -rf $(DEST)

