@echo off
:: The "%~dp0" tells it to look in the same folder as this .bat file
:: The "-u" flag is CRITICAL. It turns off buffering so Chrome gets messages instantly.
python -u "%~dp0bucket_engine.py"