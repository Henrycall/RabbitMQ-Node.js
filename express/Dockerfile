FROM node:12.14.0-alpine3.11

RUN apk add --no-cache bash

RUN echo "PS1='\w\$ '" >> /home/node/.bashrc

USER node

WORKDIR /home/node/express
