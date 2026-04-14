.PHONY: dev run install

dev:
	. .venv/bin/activate && python3 -m uvicorn main:app --reload --port 8000

run:
	. .venv/bin/activate && python3 -m uvicorn main:app --port 8000

install:
	python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt