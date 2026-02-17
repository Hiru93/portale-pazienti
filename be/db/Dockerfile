FROM postgres:14.17

LABEL author="Mattia Gallinaro"
LABEL description="Portale Pazienti DB"
LABEL version="1.0.0"

USER root
COPY --chown=1001 *.sql /docker-entrypoint-initdb.d/