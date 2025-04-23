#!/usr/bin/env python3
import http.server
import socketserver
import json
import os
from urllib.parse import urlparse

PORT = 8000

# This is the signature that should match the pubkey in tauri.conf.json
# In a real scenario, this would be the content of the .sig file generated during build
# For Tauri v2, the signature should be the exact content of the .sig file
# The signature format is important - it must be a valid base64 string without any line breaks
VALID_SIGNATURE = "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVTOVpnMTFGSWVGYTZEM2dtTC9SY2NEMWFyTTBRNjVLQmFjb1UvUlFwZGdzSHA2c1hOV3hsOUN1akNNRFRiSzEwOUF5cWlkbFpDRzBWdFdaMjlTSmprQnFIdWFGQzcxRGcwPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzQ1MzQxNzQ1CWZpbGU6ZHJua24tbm90ZXMuYXBwLnRhci5negplQ1o2VjFvUGhxQmFqSjUrNkJiREhpbTM4ZXc3aS9sR2pheVNUWEFsNGJ2YlowaFhPS2YrTmZZQlYzOERIUmFWTVZhaVRLSlVHdisycTZlMCsyMndEQT09Cg=="

class UpdateHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for all responses
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        http.server.SimpleHTTPRequestHandler.end_headers(self)
    
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path.strip('/')
        
        print(f"Received request for: {path}")
        
        # Handle update endpoint for both darwin and darwin-aarch64
        if path.startswith('darwin-aarch64/') or path.startswith('darwin/'):
            parts = path.split('/')
            if len(parts) >= 2:
                target = parts[0]
                current_version = parts[1]
                
                # Create the update JSON response based on the target platform
                platform_key = target  # Use the actual target from the request
                
                # For dynamic update server, Tauri expects a simpler JSON structure
                # This format is different from the static JSON file format
                update_json = {
                    "version": "0.2.0",
                    "notes": "Test update with bug fixes and improvements",
                    "pub_date": "2025-04-23T00:00:00Z",
                    "url": "http://localhost:8000/drnkn-notes_0.2.0_aarch64.app.tar.gz",
                    "signature": VALID_SIGNATURE
                }
                
                # Set proper headers for JSON response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                # Send the JSON response
                response_json = json.dumps(update_json, indent=2)
                self.wfile.write(response_json.encode('utf-8'))
                
                print(f"Served update JSON for {target}/{current_version}")
                print(f"JSON content: {response_json}")
                return
        
        # For any other path, serve files from the current directory
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

# Create and start the server
with socketserver.TCPServer(("", PORT), UpdateHandler) as httpd:
    print(f"Serving update server at http://localhost:{PORT}")
    print(f"Update endpoint: http://localhost:{PORT}/darwin-aarch64/0.2.0")
    print(f"Using signature that matches pubkey in tauri.conf.json")
    httpd.serve_forever()
