# ticketing-micro-services

## Setup
Create a JSON Web Token Secret
```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<your_secret>
```