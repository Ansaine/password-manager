# Structure of the project

Schema for the sql server -

1. First there will be a table to store users only (email address )
2. Details table that will keep rest details and connect with users table using a foreign key

# Notes/ Bug fixes

* MYSQL_ROOT_PASSWORD:root  and MYSQL_DATABASE:passwordManager // this is needed as env variable in docker-compose file to
  set default values when image is being initialised.


DB_HOST:mysql

DB_USER:root

DB_PASSWORD:root

MYSQL_ROOT_PASSWORD:root

MYSQL_DATABASE:passwordManager

DB_NAME:passwordManager

# Key technologies

1. Reac-router-dom for routes, useNavigate
2. JWT auth tokens for secue apis
3. cors
4. useRef
