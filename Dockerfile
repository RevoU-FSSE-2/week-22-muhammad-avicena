# Use an official Python runtime as a parent image
FROM --platform=linux/amd64 python:3.12

# Set the working directory
WORKDIR /app

# Copy Pipfile and Pipfile.lock
COPY Pipfile Pipfile.lock /app/

# Install Pipenv
RUN pip install pipenv

# Install dependencies using Pipenv
RUN pipenv install --deploy

# Expose port 5001 for Gunicorn
EXPOSE 80

# Run Gunicorn
CMD ["pipenv", "run", "gunicorn", "-b", "0.0.0.0:80", "app:app"]
