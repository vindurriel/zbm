@echo off
coffee -bc .\static\js\ > .\coffeelog.txt
START "" python .\code.py 1234
START http://localhost:1234