# CLASHDOME

## Prerequisites

Node version: `v12`  
NPM version: `v6.9.0`

## Workflow

Create a new branch from `testnet` branch with the name `username/feature_name` (for example `escrichee\new_sale_section`).
Once the feature is done open a pull-request.


## Development

How to install and run locally:  
`npm adduser` (this is necessary for npm private engines)  
`npm install` (install server side node modules, if you have any problem with private modules ask the team for permissions)  
`cd client && npm install && cd ..` (install client side node modules)  
`npm run both-prod` (start server and client)

## Production

CLIENT - Create production build:  
  
`cd client`  
`npm run build`  
Update master branch.  
  
SERVER - Pull changes and reset server:  
  
`cd /home/gameportal/gameportal`  
`git pull origin master`  
`fuser -k 80/tcp`  
`nohup npm run production &`  
