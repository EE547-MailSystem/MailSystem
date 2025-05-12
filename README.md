# EE 547 – Applied & Cloud Computing Final Report
## Project: Intelligent Email Classification


Member: 
Group 11
- Yicheng Yang: [Github](https://github.com/mark-yyc)
- Yiheng Zhou: [Github](https://github.com/unswimmingduck)
- Yibing Liu: [Github](https://github.com/Young884)]

### Summary and Description:
Email remains a critical channel for personal and professional communication, but the overwhelming volume and variety of messages make it difficult for users to prioritize and act promptly. Our project proposes a serverless, cloud-native email management system that automatically retrieves emails, classifies them into meaningful categories (e.g., finance, work, social, spam), and notifies users based on personalized priority rules. The goal is to demonstrate the application of LLM, serverless computing, and AWS cloud services in building a scalable, intelligent assistant.

### File Structure
/backend: Backend for user interaction.
/classifier: SQS consumer, automatic email classification.
/frontend: GUI (React 18).
/doc: SQL schema and API design doc.
/lambda: lambda function.
/nginx: nginx configuration.

### Build and run
1. Backend and classifier
  CI/CD: Github Actions
  Trigger: on push branches: main
  Jobs: 
  + Docker build and docker push
  + login to ec2 using ssh
  + docker compose
2. Frontend (run in localhost)
  ```
    cd frontend
    npm install
    npm run dev
  ```
3. lambda (deploy on AWS lambda workbench)
   + In folder: /lambda/res/GmailWebhook and /lambda/res/StartGmailWatch
   + run: npm install to install dependency
   + zip the entire folder
   + upload code to AWS lambda workbench
   + test and deploy
   

