FROM python:3.6

RUN mkdir /app
WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . /app

ENV FLASK_APP "crash.py"
ENTRYPOINT [ "flask" ]
CMD [ "run", "--host=0.0.0.0", "--port=80" ]

EXPOSE 80
