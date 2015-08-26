@echo off

REM Windows script for running e2e tests
REM You have to run server and capture some browser first
REM
REM Requirements:
REM - NodeJS (http://nodejs.org/)
REM - Protractor

set BASE_DIR=%~dp0
"%BASE_DIR%\..\node_modules\protractor\bin\protractor" "%BASE_DIR%\..\test\e2e\protractor.conf.js" %*
