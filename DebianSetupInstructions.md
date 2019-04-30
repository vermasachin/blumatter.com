## Blumatter Task Setup Instructions - Debian Server

### Demo: http://157.230.161.129:3000/ (not served by nginx, facing some issues with that, this one is using /public folder to serve build)

1. Login as a non-root user with sudo privileges.
2. Install UFW firewall `apt install ufw`.
3. Allow SSH access before enabling the firewall `ufw allow OpenSSH`.
4. Enable the firewall `ufw enable`.
5. install `curl` using `apt install curl`
6. Download `nvm` using `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
7. run `export NVM_DIR="${XDG_CONFIG_HOME/:-$HOME/.}nvm" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"` to add nvm to your bash profile.
8. Install node using `nvm install node`.
9. Install git using `apt install git`.
10. Clone the project using `git clone https://github.com/vermasachin/blumatter.com.git`
11. cd into `~/blumatter.com/project/` and run `npm install`.
12. Change path in `~/blumatter.com/project/frontend/app/constants/index.js` to server's IP and port 3000.
13. cd into `~/blumatter.com/project/frontend` and run `npm install` followed by `npm run build`
14. Install nginx `apt install nginx` and allow in firewall `ufw allow 'Nginx HTTP'`.
15. Go to `/etc/nginx/sites-available`, open `default` in any text editor and scroll down until you see

```
    location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }
```

Change this to:

```
    location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ /index.html;
        }
```

17. Confirm the validation of nginx config by running `sudo nginx -t` and Reload nginx server by running `sudo systemctl reload nginx`.
18. Go to `~/blumatter.com/project/` and run `cp public/. -a /var/www/html` to copy build to nginx's default server block's location.
19. run `apt install postgresql postgresql-contrib` to install postgresql.
20. Run `sudo -u postgres createuser --interactive` to add new role.
21. Create new Database `sudo -u postgres createdb blumatter`
22. login to shell using `psql -d blumatter`
23. Change db user password if required `\password username`
24. Create schema using `CREATE SCHEMA blumatter;`, don't forget the semicolon at the end.
25. Exit the shell using `CMD+Z`.
26. Go to `project/core/models` and run `psql -U username -d blumatter -a -f create.sql` to create tables and relations.
27. Install pm2 globally using `npm i pm2 -g`.
28. Go to 'project' folder and run `pm2 start app.js --name blumater`.
