FROM node:10.15.3-alpine

WORKDIR /workdir
COPY . /workdir

RUN apk add --no-cache tini && \
    yarn install --production

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["./bin/slabot"]
