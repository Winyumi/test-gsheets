FROM denoland/deno
WORKDIR /app
COPY . /app
CMD ["run", "start"]
