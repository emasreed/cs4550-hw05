#!/bin/bash

export MIX_ENV=prod
export PORT=4802

CGFD=$(readlink -f ~/.config/hello)

if [ ! -e "$CFGD/base" ]; then
	echo "Need to deploy first"
	exit 1
fi

SECRET_KEY_BASE=$(cat "$CFGD/base")
export SECRET_KEY_BASE

_build/prod/rel/hello/bin/hello start
