FROM alpine:latest

EXPOSE 3001
ENV TZ=Asia/Shanghai

COPY --chmod=755 ./dist/app /usr/local/bin/

CMD ["/usr/local/bin/app"]