# Structure of the project

Schema for the sql server -

1. First there will be a table to store users only (email address and hashed passwords )
2. Details table that will keep rest details and connect with users table using a foreign key

# Notes/ Bug fixes

* MYSQL_ROOT_PASSWORD:root  and MYSQL_DATABASE:passwordManager // this is needed as env variable in docker-compose file to
  set default values when image is being initialised.
* For using vite, i need to keep flag -
  "dev":"vite --host",
  only then it will be accessible from outside the container
* connected with docker mysql from local using -> sudo mysql -h 127.0.0.1 -P 3306 -u root -p
  If i used -h as localhost it uses socket by default which gives error, need to use 127.0.0.1 to use tcp


# Key technologies

1. Reac-router-dom for routes, useNavigate
2. JWT auth tokens for secue apis
3. cors
4. useRef
