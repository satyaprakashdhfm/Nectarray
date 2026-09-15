# Runs untrusted work: a student's Python, and now a student's LaTeX. The
# image holds nothing worth taking either way — no source but this service,
# no credentials but the two shared tokens, and no write access to its own
# filesystem.
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

WORKDIR /srv

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py runner.py latex.py ./

# Fail the build, not the first student, if a package the resume template
# loads is missing from the image.
RUN mkdir /tmp/smoke && cd /tmp/smoke \
 && printf '%s\n' \
      '\documentclass{article}' \
      '\usepackage{geometry,enumitem,xcolor,hyperref,titlesec,parskip,array,ifthen,graphicx}' \
      '\begin{document}ok\end{document}' > smoke.tex \
 && pdflatex -no-shell-escape -interaction=nonstopmode -halt-on-error smoke.tex > /dev/null \
 && cd / && rm -rf /tmp/smoke

# Never root. A student's code — and now a student's document — inherits
# this user, and it owns nothing.
RUN useradd --create-home --shell /usr/sbin/nologin judge \
 && chown -R root:root /srv && chmod -R a-w /srv
USER judge

EXPOSE 8080
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
