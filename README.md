# Tresh
Tresh is a simple CLI tool with various utility functions.

## Prerequisites
1. Node Is installed

## Installation 

Clone the repo
```pwsh
git clone https://github.com/stupidbutsmart/tresh .
rm .git -r -Force
```

Create a `run.cmd` file as follows
```bat
@echo off
node <path to index.js> %1 %2 %3 %4 %5 %6 %7 %8 %9
pause
```

Create a Symlink inside of windows/system32

Cmd Prompt
```cmd
cd C:\Windows\System32
mklink tresh.exe <path to run.cmd>
```

Run tresh in the terminal, it should return a help message
```
tresh
```


