#!/usr/bin/env python3
"""
Backend Test Suite for Wheat Farm Game
Tests backend API functionality and stability after frontend modifications
"""

import requests
import json
import time
import sys
from datetime import datetime
import os
from pathlib import Path

# Load environment variables to get the correct backend URL
def load_frontend_env():
    """Load frontend .env to get REACT_APP_BACKEND_URL"""
    frontend_env_path = Path("/app/frontend/.env")
    env_vars = {}
    
    if frontend_env_path.exists():
        with open(frontend_env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key] = value.strip('"')
    
    return env_vars

class BackendTester:
    def __init__(self):
        # Get the correct backend URL from frontend environment
        frontend_env = load_frontend_env()
        self.base_url = frontend_env.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
        self.api_url = f"{self.base_url}/api"
        
        print(f"Testing backend at: {self.api_url}")
        
        self.test_results = {
            'server_startup': False,
            'root_endpoint': False,
            'status_post': False,
            'status_get': False,
            'cors_headers': False,
            'error_handling': False
        }
        
        self.errors = []
    
    def log_error(self, test_name, error):
        """Log an error for a specific test"""
        error_msg = f"❌ {test_name}: {str(error)}"
        self.errors.append(error_msg)
        print(error_msg)
    
    def log_success(self, test_name, message=""):
        """Log a successful test"""
        success_msg = f"✅ {test_name}"
        if message:
            success_msg += f": {message}"
        print(success_msg)
    
    def test_server_connectivity(self):
        """Test if the backend server is accessible"""
        print("\n🔍 Testing server connectivity...")
        
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            if response.status_code == 200:
                self.test_results['server_startup'] = True
                self.log_success("Server Connectivity", f"Status {response.status_code}")
                return True
            else:
                self.log_error("Server Connectivity", f"Unexpected status code: {response.status_code}")
                return False
        except requests.exceptions.ConnectionError as e:
            self.log_error("Server Connectivity", f"Connection failed: {e}")
            return False
        except requests.exceptions.Timeout as e:
            self.log_error("Server Connectivity", f"Request timeout: {e}")
            return False
        except Exception as e:
            self.log_error("Server Connectivity", f"Unexpected error: {e}")
            return False
    
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        print("\n🔍 Testing root endpoint...")
        
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Hello World':
                    self.test_results['root_endpoint'] = True
                    self.log_success("Root Endpoint", "Correct response received")
                else:
                    self.log_error("Root Endpoint", f"Unexpected response: {data}")
            else:
                self.log_error("Root Endpoint", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_error("Root Endpoint", str(e))
    
    def test_status_post_endpoint(self):
        """Test creating a status check"""
        print("\n🔍 Testing POST /api/status endpoint...")
        
        try:
            test_data = {
                "client_name": "wheat_game_test_client"
            }
            
            response = requests.post(
                f"{self.api_url}/status",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'client_name', 'timestamp']
                
                if all(field in data for field in required_fields):
                    if data['client_name'] == test_data['client_name']:
                        self.test_results['status_post'] = True
                        self.log_success("POST Status", f"Created status with ID: {data['id']}")
                        return data['id']  # Return ID for further testing
                    else:
                        self.log_error("POST Status", "Client name mismatch in response")
                else:
                    self.log_error("POST Status", f"Missing required fields in response: {data}")
            else:
                self.log_error("POST Status", f"Status code: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_error("POST Status", str(e))
        
        return None
    
    def test_status_get_endpoint(self):
        """Test retrieving status checks"""
        print("\n🔍 Testing GET /api/status endpoint...")
        
        try:
            response = requests.get(f"{self.api_url}/status", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    self.test_results['status_get'] = True
                    self.log_success("GET Status", f"Retrieved {len(data)} status checks")
                    
                    # Verify structure of returned items
                    if data:
                        first_item = data[0]
                        required_fields = ['id', 'client_name', 'timestamp']
                        if all(field in first_item for field in required_fields):
                            self.log_success("GET Status Structure", "All required fields present")
                        else:
                            self.log_error("GET Status Structure", f"Missing fields in response item: {first_item}")
                else:
                    self.log_error("GET Status", f"Expected list, got: {type(data)}")
            else:
                self.log_error("GET Status", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_error("GET Status", str(e))
    
    def test_cors_headers(self):
        """Test CORS headers are properly set"""
        print("\n🔍 Testing CORS headers...")
        
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            
            cors_headers = [
                'access-control-allow-origin',
                'access-control-allow-methods',
                'access-control-allow-headers'
            ]
            
            present_headers = []
            for header in cors_headers:
                if header in response.headers:
                    present_headers.append(header)
            
            if len(present_headers) >= 1:  # At least origin header should be present
                self.test_results['cors_headers'] = True
                self.log_success("CORS Headers", f"Found: {', '.join(present_headers)}")
            else:
                self.log_error("CORS Headers", "No CORS headers found")
                
        except Exception as e:
            self.log_error("CORS Headers", str(e))
    
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        print("\n🔍 Testing error handling...")
        
        try:
            # Test invalid endpoint
            response = requests.get(f"{self.api_url}/nonexistent", timeout=10)
            
            if response.status_code == 404:
                self.test_results['error_handling'] = True
                self.log_success("Error Handling", "404 for invalid endpoint")
            else:
                self.log_error("Error Handling", f"Expected 404, got {response.status_code}")
                
            # Test invalid POST data
            response = requests.post(
                f"{self.api_url}/status",
                json={"invalid": "data"},
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code in [400, 422]:  # FastAPI returns 422 for validation errors
                self.log_success("Error Handling", f"Proper validation error: {response.status_code}")
            else:
                self.log_error("Error Handling", f"Expected 400/422 for invalid data, got {response.status_code}")
                
        except Exception as e:
            self.log_error("Error Handling", str(e))
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend Test Suite for Wheat Farm Game")
        print("=" * 60)
        
        # Test server connectivity first
        if not self.test_server_connectivity():
            print("\n❌ Server is not accessible. Stopping tests.")
            return False
        
        # Run all other tests
        self.test_root_endpoint()
        status_id = self.test_status_post_endpoint()
        self.test_status_get_endpoint()
        self.test_cors_headers()
        self.test_error_handling()
        
        # Print summary
        self.print_summary()
        
        # Return overall success
        return all(self.test_results.values())
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results.values() if result)
        total = len(self.test_results)
        
        print(f"Tests Passed: {passed}/{total}")
        
        for test_name, result in self.test_results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"  {test_name}: {status}")
        
        if self.errors:
            print(f"\n🚨 ERRORS ENCOUNTERED ({len(self.errors)}):")
            for error in self.errors:
                print(f"  {error}")
        
        overall_status = "✅ ALL TESTS PASSED" if all(self.test_results.values()) else "❌ SOME TESTS FAILED"
        print(f"\n🎯 OVERALL STATUS: {overall_status}")

def main():
    """Main test execution"""
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()