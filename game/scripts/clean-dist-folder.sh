#!/bin/sh

cd public
if [ -d "dist" ]
then
rm -R dist
fi
mkdir dist

