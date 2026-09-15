# A document can read files and loop forever, so the image holds nothing
# worth reaching: TeX, this service, and one shared token.
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

# geometry, xcolor and hyperref come with base and recommended; enumitem and
# titlesec, which the resume template needs, Debian only ships in latex-extra.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      texlive-latex-base \
      texlive-latex-recommended \
      texlive-latex-extra \
      texlive-fonts-recommended \
 && rm -rf /var/lib/apt/lists/*

# Fail the build, not the first student, if a package the template loads is
# missing from the image.
RUN mkdir /tmp/smoke && cd /tmp/smoke \
 && printf '%s\n' \
      '\documentclass{article}' \
      '\usepackage{geometry,enumitem,xcolor,hyperref,titlesec,parskip,array,ifthen,graphicx}' \
      '\begin{document}ok\end{document}' > smoke.tex \
 && pdflatex -no-shell-escape -interaction=nonstopmode -halt-on-error smoke.tex > /dev/null \
 && cd / && rm -rf /tmp/smoke

WORKDIR /srv

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py ./

RUN useradd --create-home --shell /usr/sbin/nologin latex \
 && chown -R root:root /srv && chmod -R a-w /srv
USER latex

EXPOSE 8080
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
