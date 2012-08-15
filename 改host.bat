REM 在host中加入信息, 之后在浏览器中输入http://www.fan.com就可以访问订饭网站
@echo off
set hostpath=%windir%\System32\drivers\etc\hosts
echo. >>%hostpath%
echo 10.2.0.254 fan >> %hostpath%