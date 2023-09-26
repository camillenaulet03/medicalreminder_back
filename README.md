# Medicalreminder back

## Required dependencies

First of all, certain installations are required to be able to use this project:

- [Node.js](https://nodejs.org/en/download/) (version 16 or higher)
- [Twilio](https://www.twilio.com/fr-fr/messaging/channels/sms) (create your account)

## Project setup

First copy the parameters below into the `.env` and complete them according to your environment

```yaml
JWT_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImI4NzVkZWZiMDU0ZDVjNDVmMjVhOTRkZTUxZGZkMzI3In0.e30.O9YMI45GZaSXoejsUR-jfPP7vccdfHMNzteOMUUPr5ueRzNuUkTbt1HHvhHpSainvYbE2iPPy27ncLW7b1OaQQ

# url front
ENVFRONT=

# data database
HOST=
USERDB=
PASSWORDDB=
DATABASE=

# data twilio
SID=
TOKEN=
VAD=
USER=
PASS=
```

### Database

Before launching the application, you must import SQL files in your database : [Download SQL file](medicalreminder.sql)

### Launch the application

```
npm run start
```

## Swagger

When the back is launched, you can access to the documentation : http://localhost:3000/api-docs/
