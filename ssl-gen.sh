mkdir ssl
openssl genrsa -out ssl/key.pem 1024
openssl req -new -key ssl/key.pem -out csr.pem
openssl x509 -req -in ssl/csr.pem -signkey ssl/key.pem -out ssl/cert.pem
