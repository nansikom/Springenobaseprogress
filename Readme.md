# Docker installation
First you will need to have docker running 
docker run -d --name pg-plv8 -p 5434:5432 sibedge/postgres-plv8:latest                                    
                                                                                                                                               
docker exec -it pg-plv8 psql -U postgres       

#  Start up the postgres server 
Next start up the psql postgres server
psql -h localhost -p 5434 -U postgres -d postgres  
Password for user postgres: ******
# Next start up the psql postgres server
psql -h localhost -p 5434 -U postgres -d postgres  
Password for user postgres: postgres    

# run npm install.                                           
run node gemini.js
run node server.js

Go to indie.html
Go to code editing where you will find the monaco editor 
Upload a dataset
Wrtie your code in the monacco editor
Run the code
Test out the predictions.html for running linear regression, clustering and averaging, anomaly detection against your dataset

