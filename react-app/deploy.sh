npm run build
if [ -d "../vertx/src/main/resources/webroot/" ]; then rm -Rf ../vertx/src/main/resources/webroot/; fi
mkdir ../vertx/src/main/resources/webroot/
cp -R build/* ../vertx/src/main/resources/webroot/
