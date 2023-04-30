FROM continuumio/miniconda:latest

# Copy everything into the folder and move on from there
WORKDIR /app

# Create the environment
COPY environment.yml .
RUN conda env create -f environment.yml

# Make RUN commands use the new environment
SHELL ["conda", "run", "-n", "pachtop-update-server", "/bin/bash", "-c"]

# Copy python files into WorkDir
COPY *.py .

# Open port 5000
EXPOSE 5000

# Run the Update Server
ENTRYPOINT ["conda", "run", "-n", "pachtop-update-server", "python", "main.py"]