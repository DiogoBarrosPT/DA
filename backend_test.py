#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class PastryAPITester:
    def __init__(self, base_url="https://pastry-degrau.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text and response.status_code < 500 else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_admin_login(self):
        """Test admin login and get token"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@degrauazul.pt", "password": "degrauazul2024"}
        )
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_get_categories(self):
        """Test getting categories"""
        success, response = self.run_test(
            "Get Categories",
            "GET",
            "categories",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} categories")
            for cat in response[:3]:  # Show first 3
                print(f"   - {cat.get('name', 'Unknown')}: {cat.get('description', 'No description')}")
        return success, response

    def test_get_menu(self):
        """Test getting menu items"""
        success, response = self.run_test(
            "Get Menu Items",
            "GET",
            "menu",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} menu items")
            for item in response[:3]:  # Show first 3
                print(f"   - {item.get('name', 'Unknown')}: {item.get('price', 0)}€")
        return success, response

    def test_get_featured_menu(self):
        """Test getting featured menu items"""
        success, response = self.run_test(
            "Get Featured Menu Items",
            "GET",
            "menu/featured",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} featured items")
        return success

    def test_get_gallery(self):
        """Test getting gallery items"""
        success, response = self.run_test(
            "Get Gallery Items",
            "GET",
            "gallery",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} gallery items")
        return success, response

    def test_submit_contact_message(self):
        """Test submitting a contact message"""
        test_message = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": "test@example.com",
            "phone": "+351 912 345 678",
            "message": "This is a test message from automated testing.",
            "type": "contact"
        }
        
        success, response = self.run_test(
            "Submit Contact Message",
            "POST",
            "messages",
            200,
            data=test_message
        )
        return success, response.get('id') if success else None

    def test_submit_order_message(self):
        """Test submitting an order message"""
        test_order = {
            "name": f"Test Customer {datetime.now().strftime('%H%M%S')}",
            "email": "customer@example.com",
            "phone": "+351 987 654 321",
            "message": "I would like to order 12 pastéis de nata for tomorrow morning.",
            "type": "order"
        }
        
        success, response = self.run_test(
            "Submit Order Message",
            "POST",
            "messages",
            200,
            data=test_order
        )
        return success, response.get('id') if success else None

    def test_admin_get_messages(self):
        """Test admin getting messages"""
        success, response = self.run_test(
            "Admin Get Messages",
            "GET",
            "messages",
            200,
            auth_required=True
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} messages")
            unread = sum(1 for msg in response if not msg.get('read', True))
            print(f"   Unread messages: {unread}")
        return success

    def test_admin_create_category(self):
        """Test admin creating a category"""
        test_category = {
            "name": f"Test Category {datetime.now().strftime('%H%M%S')}",
            "description": "Test category created by automated testing",
            "order": 99
        }
        
        success, response = self.run_test(
            "Admin Create Category",
            "POST",
            "categories",
            200,
            data=test_category,
            auth_required=True
        )
        return success, response.get('id') if success else None

    def test_admin_create_menu_item(self, category_id):
        """Test admin creating a menu item"""
        test_item = {
            "name": f"Test Item {datetime.now().strftime('%H%M%S')}",
            "description": "Test menu item created by automated testing",
            "price": 2.50,
            "category_id": category_id,
            "image_url": "",
            "available": True,
            "featured": False
        }
        
        success, response = self.run_test(
            "Admin Create Menu Item",
            "POST",
            "menu",
            200,
            data=test_item,
            auth_required=True
        )
        return success, response.get('id') if success else None

    def test_admin_create_gallery_item(self):
        """Test admin creating a gallery item"""
        test_gallery = {
            "image_url": "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400",
            "caption": f"Test image {datetime.now().strftime('%H%M%S')}",
            "order": 99
        }
        
        success, response = self.run_test(
            "Admin Create Gallery Item",
            "POST",
            "gallery",
            200,
            data=test_gallery,
            auth_required=True
        )
        return success, response.get('id') if success else None

    def test_admin_delete_item(self, item_type, item_id):
        """Test admin deleting an item"""
        endpoint_map = {
            "category": "categories",
            "menu": "menu",
            "gallery": "gallery",
            "message": "messages"
        }
        
        endpoint = endpoint_map.get(item_type)
        if not endpoint:
            return False
            
        success, _ = self.run_test(
            f"Admin Delete {item_type.title()}",
            "DELETE",
            f"{endpoint}/{item_id}",
            200,
            auth_required=True
        )
        return success

    def test_auth_me(self):
        """Test getting current user info"""
        success, response = self.run_test(
            "Get Current User Info",
            "GET",
            "auth/me",
            200,
            auth_required=True
        )
        if success:
            print(f"   User: {response.get('email', 'Unknown')} ({response.get('role', 'Unknown')})")
        return success

    def test_logout(self):
        """Test logout"""
        success, _ = self.run_test(
            "Admin Logout",
            "POST",
            "auth/logout",
            200,
            auth_required=True
        )
        if success:
            self.token = None
        return success

def main():
    print("🧪 Starting Pasteçaria Degrau Azul API Tests")
    print("=" * 60)
    
    tester = PastryAPITester()
    
    # Test basic endpoints first
    print("\n📋 BASIC ENDPOINTS")
    tester.test_root_endpoint()
    
    # Test public endpoints
    print("\n🌐 PUBLIC ENDPOINTS")
    categories_success, categories = tester.test_get_categories()
    menu_success, menu_items = tester.test_get_menu()
    tester.test_get_featured_menu()
    gallery_success, gallery = tester.test_get_gallery()
    
    # Test message submission
    print("\n📧 MESSAGE SUBMISSION")
    contact_msg_id = tester.test_submit_contact_message()[1]
    order_msg_id = tester.test_submit_order_message()[1]
    
    # Test authentication
    print("\n🔐 AUTHENTICATION")
    if not tester.test_admin_login():
        print("❌ Admin login failed, stopping admin tests")
        print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
        return 1
    
    tester.test_auth_me()
    
    # Test admin endpoints
    print("\n👨‍💼 ADMIN ENDPOINTS")
    tester.test_admin_get_messages()
    
    # Test CRUD operations
    print("\n🔧 CRUD OPERATIONS")
    
    # Create test items
    test_cat_id = tester.test_admin_create_category()[1]
    test_item_id = None
    if test_cat_id and categories:
        # Use first existing category for menu item
        first_cat_id = categories[0].get('id') if categories else test_cat_id
        test_item_id = tester.test_admin_create_menu_item(first_cat_id)[1]
    
    test_gallery_id = tester.test_admin_create_gallery_item()[1]
    
    # Clean up test items
    print("\n🧹 CLEANUP")
    if test_cat_id:
        tester.test_admin_delete_item("category", test_cat_id)
    if test_item_id:
        tester.test_admin_delete_item("menu", test_item_id)
    if test_gallery_id:
        tester.test_admin_delete_item("gallery", test_gallery_id)
    if contact_msg_id:
        tester.test_admin_delete_item("message", contact_msg_id)
    if order_msg_id:
        tester.test_admin_delete_item("message", order_msg_id)
    
    # Test logout
    tester.test_logout()
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success rate: {success_rate:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())