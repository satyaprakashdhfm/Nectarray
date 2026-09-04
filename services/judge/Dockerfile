# The runner executes code we did not write, so the image holds nothing worth
# taking: no source but this service, no credentials but the shared token, and
# no write access to its own filesystem.
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /srv

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py runner.py ./

# Never root. A student's code inherits this user, and it owns nothing.
RUN useradd --create-home --shell /usr/sbin/nologin judge \
 && chown -R root:root /srv && chmod -R a-w /srv
USER judge

EXPOSE 8080
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
