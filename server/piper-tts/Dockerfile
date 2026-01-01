FROM python:3.11-slim

WORKDIR /app


RUN apt-get update && apt-get install -y \
    build-essential \
    libsndfile1 \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*


RUN python3 -m pip install --upgrade pip setuptools wheel


RUN python3 -m pip install "piper-tts[http]"


# RUN python3 -m piper.download_voices en_US-lessac-medium
# RUN python3 -m piper.download_voices hi_IN-rohan-medium
# RUN python3 -m piper.download_voices en_GB-northern_english_male-medium
RUN python3 -m piper.download_voices hi_IN-pratham-medium

EXPOSE 5001

CMD ["python3", "-m", "piper.http_server", "-m", "hi_IN-pratham-medium", "--host", "0.0.0.0", "--port", "5001"]