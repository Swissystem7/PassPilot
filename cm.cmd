@echo off
cd /d D:\claude-node\jobs\repos\PassPilot
set GIT="C:\Program Files\Git\cmd\git.exe"
%GIT% add -A
%GIT% -c user.name=Swissystem7 -c user.email=aviran2606@gmail.com commit -q -F commitmsg.txt
%GIT% push -q origin HEAD
echo PUSHED
