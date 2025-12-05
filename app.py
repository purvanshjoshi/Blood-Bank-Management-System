"""
Blood Bank Management System - Main Application Module

This module contains the core Flask application setup and configuration for the 
Blood Bank Management System. It initializes the Flask app with CORS support,
handles environment configuration, and sets up the main application routing.

Key Features:
    - Flask-based web framework
    - CORS configuration for cross-origin requests
    - Multi-platform executable support (Windows/Linux)
    - Modular path configuration for backend and frontend components

Author: Purvansh Joshi, Parth Maliwal, Vansh Singh
Date: 2025
Version: 1.0.0
"""

from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
import subprocess
import json
import os
import requests
import platform

app = Flask(__name__)
app.secret_key = 'blood_bank_secret_key_2024'

# CORS configuration
CORS(app, supports_credentials=True)

# Configuration - UPDATED FOR YOUR STRUCTURE
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # This is backend folder
ROOT_DIR = os.path.dirname(BASE_DIR)  # This is the DSA-PBL root folder

# CPP executables are in backend/cpp_executables
CPP_EXECUTABLES_PATH = os.path.join(BASE_DIR, 'cpp_executables')

# Data folder is in backend/data
DATA_PATH = os.path.join(BASE_DIR, 'data')

# Frontend files are in frontend folder in root directory
FRONTEND_PATH = os.path.join(ROOT_DIR, 'frontend')

def get_executable_name(executable_base):
    """Get the correct executable name based on OS"""
    if platform.system() == "Windows":
        return f"{executable_base}.exe"
    else:
        return executable_base

def run_cpp_executable(executable_name, args):
    """Helper function to run C++ executables and capture output"""
    try:
        executable_path = os.path.join(CPP_EXECUTABLES_PATH, get_executable_name(executable_name))
        
        print(f"Running executable: {executable_path}")
        print(f"With arguments: {args}")
        
        if not os.path.exists(executable_path):
            return {'success': False, 'error': f'Executable not found: {executable_path}'}
        
        # Ensure data directory exists and is writable
        os.makedirs(DATA_PATH, exist_ok=True)
        
        # Check if data directory is writable
        test_file = os.path.join(DATA_PATH, 'test_write.tmp')
        try:
            with open(test_file, 'w') as f:
                f.write('test')
            os.remove(test_file)
        except Exception as e:
            print(f"Data directory not writable: {e}")
            return {'success': False, 'error': f'Data directory not writable: {str(e)}'}
        
        # Run from DATA_PATH directory where donors.txt should be
        result = subprocess.run([executable_path] + args,
                              capture_output=True, text=True, timeout=30,
                              cwd=DATA_PATH)  # Run from data directory
        
        print(f"Executable output - Return code: {result.returncode}")
        print(f"STDOUT: {result.stdout}")
        print(f"STDERR: {result.stderr}")
        
        if result.returncode == 0:
            return {'success': True, 'output': result.stdout.strip()}
        else:
            # Provide more specific error messages
            error_msg = result.stderr.strip()
            if "elevation" in error_msg.lower() or "admin" in error_msg.lower():
                return {'success': False, 'error': 'Permission denied. Please ensure the application has write access to the data directory.'}
            elif "not found" in error_msg.lower():
                return {'success': False, 'error': 'Data file not found or inaccessible.'}
            else:
                return {'success': False, 'error': error_msg if error_msg else 'Unknown error occurred'}
                
    except subprocess.TimeoutExpired:
        return {'success': False, 'error': 'Operation timed out'}
    except Exception as e:
        print(f"Exception running executable: {str(e)}")
        if "elevation" in str(e).lower() or "admin" in str(e).lower():
            return {'success': False, 'error': 'Permission denied. Please run the application as administrator or move to a writable location.'}
        return {'success': False, 'error': str(e)}

# Serve frontend files (keep all your existing routes exactly the same)
@app.route('/')
def serve_index():
    """Serve the main index.html page"""
    try:
        return send_from_directory(FRONTEND_PATH, 'index.html')
    except Exception as e:
        return f"Error serving index.html: {str(e)}", 404

@app.route('/<path:filename>')
def serve_frontend(filename):
    """Serve all other frontend files (CSS, JS, etc.)"""
    try:
        # Serve from frontend directory
        return send_from_directory(FRONTEND_PATH, filename)
    except Exception as e:
        return f"File not found: {filename}", 404

@app.route('/login')
def serve_login():
    """Serve login page directly"""
    try:
        return send_from_directory(FRONTEND_PATH, 'login.html')
    except Exception as e:
        return f"Error serving login.html: {str(e)}", 404

# API Routes (keep all your existing API routes exactly as they are)
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.json
    username = data.get('username', '')
    password = data.get('password', '')
    
    if username == 'purvansh joshi' and password == '12345':
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'error': 'Invalid credentials'})

@app.route('/api/add_donor', methods=['POST', 'OPTIONS'])
def add_donor():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.json
    args = [
        data['name'],
        data['phone'],
        data['bloodGroup'],
        data['address'],
        str(data['latitude']),
        str(data['longitude'])
    ]
    
    result = run_cpp_executable('add_donor', args)
    return jsonify(result)

@app.route('/api/delete_donor', methods=['POST', 'OPTIONS'])
def delete_donor():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.json
    args = [data['phone'], data['bloodGroup']]
    
    result = run_cpp_executable('delete_donor', args)
    return jsonify(result)

@app.route('/api/update_donor', methods=['POST', 'OPTIONS'])
def update_donor():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.json
    args = [
        data['oldPhone'],
        data['bloodGroup'],
        data['newAddress'],
        data['newPhone']
    ]
    
    print(f"Update donor called with: {data}")
    result = run_cpp_executable('update_donor', args)
    print(f"Update donor result: {result}")
    return jsonify(result)

@app.route('/api/search_donors', methods=['POST', 'OPTIONS'])
def search_donors():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.json
    args = [
        data['bloodGroup'],
        str(data['hospitalLat']),
        str(data['hospitalLon'])
    ]
    
    result = run_cpp_executable('search_donor', args)
    if result['success']:
        try:
            donors_data = json.loads(result['output'])
            return jsonify({'success': True, 'data': donors_data})
        except json.JSONDecodeError as e:
            return jsonify({'success': False, 'error': f'JSON decode error: {str(e)}. Output: {result["output"]}'})
    return jsonify(result)

@app.route('/api/display_donors', methods=['GET', 'OPTIONS'])
def display_donors():
    if request.method == 'OPTIONS':
        return '', 200
        
    blood_group = request.args.get('bloodGroup', 'all')
    
    args = [blood_group] if blood_group != 'all' else []
    
    result = run_cpp_executable('display_donors', args)
    if result['success']:
        try:
            donors_data = json.loads(result['output'])
            return jsonify({'success': True, 'data': donors_data})
        except json.JSONDecodeError as e:
            return jsonify({'success': False, 'error': f'JSON decode error: {str(e)}. Output: {result["output"]}'})
    return jsonify(result)

@app.route('/api/geocode', methods=['POST', 'OPTIONS'])
def geocode_address():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.json
    address = data.get('address', '')
    
    if not address:
        return jsonify({'success': False, 'error': 'No address provided'})
    
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': address,
            'format': 'json',
            'limit': 1,
            'addressdetails': 1
        }
        headers = {
            'User-Agent': 'BloodBankManagementSystem/1.0'
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        
        if response.status_code == 200:
            results = response.json()
            if results:
                return jsonify({
                    'success': True,
                    'latitude': float(results[0]['lat']),
                    'longitude': float(results[0]['lon']),
                    'display_name': results[0]['display_name']
                })
        
        return jsonify({'success': False, 'error': 'Address not found'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    # Ensure directories exist
    os.makedirs(CPP_EXECUTABLES_PATH, exist_ok=True)
    os.makedirs(DATA_PATH, exist_ok=True)
    
    print("Blood Bank Management System starting...")
    print(f"Backend directory: {BASE_DIR}")
    print(f"Root directory: {ROOT_DIR}")
    print(f"CPP executables path: {CPP_EXECUTABLES_PATH}")
    print(f"Data path: {DATA_PATH}")
    print(f"Frontend path: {FRONTEND_PATH}")
    
    # Check if frontend files exist
    print("\nChecking frontend files in frontend folder:")
    frontend_files = ['index.html', 'login.html', 'styles.css', 'scripts.js']
    for file in frontend_files:
        file_path = os.path.join(FRONTEND_PATH, file)
        if os.path.exists(file_path):
            print(f"  ✓ {file} - Found")
        else:
            print(f"  ✗ {file} - Missing at {file_path}")
    
    # Check if frontend folder exists
    print(f"\nFrontend folder exists: {os.path.exists(FRONTEND_PATH)}")
    if os.path.exists(FRONTEND_PATH):
        print(f"Files in frontend folder: {os.listdir(FRONTEND_PATH)}")
    
    # Check if data directory exists
    print(f"\nData directory exists: {os.path.exists(DATA_PATH)}")
    
    print("\nAccess the application at: http://localhost:5000")
    print("Or directly to login: http://localhost:5000/login")
    print("Login credentials: Username: 'purvansh joshi', Password: '12345'")
    

    app.run(debug=True, host='0.0.0.0', port=5000)
