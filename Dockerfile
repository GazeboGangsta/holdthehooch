FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy site files
COPY index.html /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/
COPY css/ /usr/share/nginx/html/css/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 3003
