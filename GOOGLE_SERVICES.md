# Google Services — ElectEd

## Vertex AI
Model: gemini-2.5-pro
Usage: ANALYST, BUILDER, and EVALUATOR agents
Auth: Cloud Run service account with roles/aiplatform.user

## Firebase Authentication
Usage: Mandatory Google Sign-In before app access
Provider: Google OAuth 2.0 via Firebase Auth SDK

## Cloud Firestore
Usage: Persists user learning sessions after quiz completion
Collection: sessions/{userId}/records/{timestamp}

## Cloud Logging
Usage: Structured JSON logs from all API routes
Ingestion: Automatic via Cloud Run stdout

## Cloud Run
Region: us-central1, min-instances=1

## Cloud IAM
Usage: Service account auth for Vertex AI — no API keys

## Cloud Build
Usage: Multi-stage Docker image build and push
