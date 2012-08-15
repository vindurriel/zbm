@echo off
coffee -bc .\static\js\
START "" python .\code.py 1234
START http://localhost:1234