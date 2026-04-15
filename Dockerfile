# Use a slim Python image for efficiency
FROM python:3.12-slim

# Create a non-privileged user to run the code
RUN addgroup --system codeuser && adduser --system --ingroup codeuser codeuser

# Set working directory
WORKDIR /app

# Install necessary libraries (e.g., if you need numpy or pandas)
RUN pip install --no-cache-dir numpy

# Switch to the non-privileged user
USER codeuser

# Command to execute the user's Python script
# --rm: Automatically remove container after exit
# --network none: Disable internet access
# --memory 128m: Limit RAM to prevent DoS attacks
# ENTRYPOINT is set in your FastAPI code via docker run commands
