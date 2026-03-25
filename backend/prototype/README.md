This is a modular eKYC Steps 1-3 prototype. To run:
1. Install tesseract (system binary) and Python packages from requirements.txt
2. Run liveness demo: python app.py liveness --duration 15
3. Run PAN capture: python app.py pan
4. Run signature server: python app.py signature (open http://127.0.0.1:5000)

WARNING: This is a demo prototype only. Do not use in production without security, compliance, and QA.
```
