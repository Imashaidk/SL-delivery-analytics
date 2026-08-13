# Use lightweight Python image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire workspace (including backend/, models/, and data/)
COPY . .

# Hugging Face Spaces require applications to run on port 7860
ENV PORT=7860
EXPOSE 7860

# Run the FastAPI server
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
