FROM continuumio/miniconda:latest

# Copy everything into the folder and move on from there
WORKDIR /app
COPY . /app

# Install requirements
RUN conda install --yes --file requirements.txt

# Open port 5000
EXPOSE 5000

# Run the Update Server
CMD ["python", "update_server.py"]