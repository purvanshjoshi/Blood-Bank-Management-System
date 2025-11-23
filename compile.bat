@echo off
echo Compiling Blood Bank Management System...

REM Create directories in the correct locations
mkdir "..\cpp_executables" 2>nul
mkdir "..\data" 2>nul

echo Compiling main library...
g++ -std=c++17 -O2 -c main.cpp -o main.o

echo Compiling validation...
g++ -std=c++17 -O2 -c validation.cpp -o validation.o

echo Compiling add_donor...
g++ -std=c++17 -O2 add.cpp main.o validation.o -o "..\cpp_executables\add_donor.exe"

echo Compiling delete_donor...
g++ -std=c++17 -O2 delete.cpp main.o validation.o -o "..\cpp_executables\delete_donor.exe"

echo Compiling update_donor...
g++ -std=c++17 -O2 update.cpp main.o validation.o -o "..\cpp_executables\update_donor.exe"

echo Compiling search_donor...
g++ -std=c++17 -O2 search.cpp main.o validation.o -o "..\cpp_executables\search_donor.exe"

echo Compiling display_donors...
g++ -std=c++17 -O2 display.cpp main.o validation.o -o "..\cpp_executables\display_donors.exe"

echo Cleaning up...
del *.o 2>nul

echo Compilation complete!
echo.
echo Executables created in cpp_executables folder:
dir "..\cpp_executables\*.exe"

pause