# Copyright (c) 2019 Red Hat, Inc.
# This program and the accompanying materials are made
# available under the terms of the Eclipse Public License 2.0
# which is available at https://www.eclipse.org/legal/epl-2.0/
#
# SPDX-License-Identifier: EPL-2.0
#
# Contributors:
#   Red Hat, Inc. - initial API and implementation

# This is a Dockerfile allowing to build typescript plugin by using a docker container.
# $ docker build -t che-typescript-language .

FROM node:8.10.0
ARG GITHUB_TOKEN
ENV VSCODE_VERSION 1.30.2

COPY /src/patch.diff /tmp/patch.diff

RUN if [ ! -z "${GITHUB_TOKEN-}" ]; then \
	export GITHUB_TOKEN=$GITHUB_TOKEN; \
	echo "Setting GITHUB_TOKEN value as provided"; \
    fi; \
    apt-get update && apt-get install -y git \
	libsecret-1-dev \
	python \
	python-dev \
	python-pip \
	python-virtualenv \
	pkg-config \
	libxkbfile-dev \
	; \
	apt-get -y clean && rm -rf /var/lib/apt/lists/* \
	; \
	export PKG_CONFIG_PATH=/usr/lib/pkgconfig \
	; \
	git clone --branch ${VSCODE_VERSION} --single-branch https://github.com/Microsoft/vscode /tmp/vscode \
	; \
	cd /tmp/vscode && cp /tmp/patch.diff . && patch -p1 < patch.diff \ 
	; \
	npm i yarn && yarn && yarn compile
	
RUN	cp -r /tmp/vscode/node_modules/typescript /tmp/vscode/extensions/typescript-language-features/node_modules/typescript \
	; \
	cp /tmp/vscode/LICENSE.txt /tmp/vscode/extensions/typescript-language-features \
	; \
	cd /tmp/vscode/extensions/typescript-language-features && tar cf /tmp/che-typescript-language.tar * \
	; \
	gzip /tmp/che-typescript-language.tar
	
CMD zcat /tmp/che-typescript-language.tar.gz
