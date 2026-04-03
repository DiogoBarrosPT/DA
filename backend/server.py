from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import bcrypt
import jwt
import uuid
import secrets
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from bson import ObjectId

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# JWT config
JWT_ALGORITHM = "HS256"

def get_jwt_secret():
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ========== AUTH MODELS ==========
class LoginRequest(BaseModel):
    email: str
    password: str

# ========== AUTH ROUTES ==========
@api_router.post("/auth/login")
async def login(req: LoginRequest, response: Response):
    email = req.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    uid = str(user["_id"])
    access_token = create_access_token(uid, email)
    refresh_token = create_refresh_token(uid)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return {"id": uid, "email": user["email"], "name": user.get("name", ""), "role": user.get("role", "admin"), "token": access_token}

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {"id": user["_id"], "email": user["email"], "name": user.get("name", ""), "role": user.get("role", "")}

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}

# ========== MENU MODELS ==========
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    order: int = 0

class MenuItemCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    price: float
    category_id: str
    image_url: Optional[str] = ""
    available: bool = True
    featured: bool = False

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[str] = None
    image_url: Optional[str] = None
    available: Optional[bool] = None
    featured: Optional[bool] = None

# ========== MENU ROUTES ==========
@api_router.get("/categories")
async def get_categories():
    cats = await db.categories.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return cats

@api_router.post("/categories")
async def create_category(cat: CategoryCreate, user: dict = Depends(get_current_user)):
    doc = cat.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.categories.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api_router.put("/categories/{cat_id}")
async def update_category(cat_id: str, cat: CategoryCreate, user: dict = Depends(get_current_user)):
    update_data = cat.model_dump()
    result = await db.categories.update_one({"id": cat_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Updated"}

@api_router.delete("/categories/{cat_id}")
async def delete_category(cat_id: str, user: dict = Depends(get_current_user)):
    await db.categories.delete_one({"id": cat_id})
    await db.menu_items.delete_many({"category_id": cat_id})
    return {"message": "Deleted"}

@api_router.get("/menu")
async def get_menu():
    items = await db.menu_items.find({}, {"_id": 0}).to_list(500)
    return items

@api_router.get("/menu/featured")
async def get_featured():
    items = await db.menu_items.find({"featured": True, "available": True}, {"_id": 0}).to_list(20)
    return items

@api_router.post("/menu")
async def create_menu_item(item: MenuItemCreate, user: dict = Depends(get_current_user)):
    doc = item.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.menu_items.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api_router.put("/menu/{item_id}")
async def update_menu_item(item_id: str, item: MenuItemUpdate, user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.menu_items.update_one({"id": item_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Updated"}

@api_router.delete("/menu/{item_id}")
async def delete_menu_item(item_id: str, user: dict = Depends(get_current_user)):
    await db.menu_items.delete_one({"id": item_id})
    return {"message": "Deleted"}

# ========== CONTACT / ORDER MESSAGES ==========
class MessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    message: str
    type: str = "contact"  # "contact" or "order"

@api_router.post("/messages")
async def create_message(msg: MessageCreate):
    doc = msg.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["read"] = False
    await db.messages.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api_router.get("/messages")
async def get_messages(user: dict = Depends(get_current_user)):
    msgs = await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return msgs

@api_router.put("/messages/{msg_id}/read")
async def mark_message_read(msg_id: str, user: dict = Depends(get_current_user)):
    await db.messages.update_one({"id": msg_id}, {"$set": {"read": True}})
    return {"message": "Marked as read"}

@api_router.delete("/messages/{msg_id}")
async def delete_message(msg_id: str, user: dict = Depends(get_current_user)):
    await db.messages.delete_one({"id": msg_id})
    return {"message": "Deleted"}

# ========== GALLERY ==========
class GalleryItemCreate(BaseModel):
    image_url: str
    caption: Optional[str] = ""
    order: int = 0

@api_router.get("/gallery")
async def get_gallery():
    items = await db.gallery.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items

@api_router.post("/gallery")
async def create_gallery_item(item: GalleryItemCreate, user: dict = Depends(get_current_user)):
    doc = item.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.gallery.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api_router.delete("/gallery/{item_id}")
async def delete_gallery_item(item_id: str, user: dict = Depends(get_current_user)):
    await db.gallery.delete_one({"id": item_id})
    return {"message": "Deleted"}

# ========== ROOT ==========
@api_router.get("/")
async def root():
    return {"message": "Pasteçaria Degrau Azul API"}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Seed data on startup
@app.on_event("startup")
async def startup():
    # Create indexes
    await db.users.create_index("email", unique=True)
    
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@degrauazul.pt")
    admin_password = os.environ.get("ADMIN_PASSWORD", "degrauazul2024")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user seeded: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated")
    
    # Seed categories if empty
    cat_count = await db.categories.count_documents({})
    if cat_count == 0:
        categories = [
            {"id": str(uuid.uuid4()), "name": "Pastelaria", "description": "Os nossos pasteis artesanais", "order": 1, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Cafetaria", "description": "Cafes e bebidas quentes", "order": 2, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Salgados", "description": "Salgados e refeicoes ligeiras", "order": 3, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Bebidas", "description": "Sumos naturais e bebidas frescas", "order": 4, "created_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.categories.insert_many(categories)
        
        # Seed menu items
        cats = await db.categories.find({}, {"_id": 0}).to_list(10)
        cat_map = {c["name"]: c["id"] for c in cats}
        
        items = [
            {"id": str(uuid.uuid4()), "name": "Pastel de Nata", "description": "O classico pastel de nata, crocante por fora e cremoso por dentro", "price": 1.50, "category_id": cat_map["Pastelaria"], "image_url": "https://images.unsplash.com/photo-1771835101104-654333861d53?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxwb3J0dWd1ZXNlJTIwcGFzdGVsJTIwZGUlMjBuYXRhJTIwY29mZmVlfGVufDB8fHx8MTc3NTI0Mzk3OHww&ixlib=rb-4.1.0&q=85", "available": True, "featured": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Bola de Berlim", "description": "Bola de berlim recheada com creme pasteleiro", "price": 2.00, "category_id": cat_map["Pastelaria"], "image_url": "https://images.unsplash.com/photo-1687182845783-dc091d25bcc9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxwb3J0dWd1ZXNlJTIwcGFzdGVsJTIwZGUlMjBuYXRhJTIwY29mZmVlfGVufDB8fHx8MTc3NTI0Mzk3OHww&ixlib=rb-4.1.0&q=85", "available": True, "featured": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Croissant Misto", "description": "Croissant folhado com fiambre e queijo", "price": 2.50, "category_id": cat_map["Salgados"], "image_url": "https://images.unsplash.com/photo-1668396001678-d33131800ea7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxwb3J0dWd1ZXNlJTIwcGFzdGVsJTIwZGUlMjBuYXRhJTIwY29mZmVlfGVufDB8fHx8MTc3NTI0Mzk3OHww&ixlib=rb-4.1.0&q=85", "available": True, "featured": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Tosta Mista", "description": "Tosta de fiambre e queijo derretido", "price": 3.00, "category_id": cat_map["Salgados"], "image_url": "", "available": True, "featured": False, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Cafe Expresso", "description": "Cafe expresso tradicional portugues", "price": 0.80, "category_id": cat_map["Cafetaria"], "image_url": "", "available": True, "featured": False, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Galao", "description": "Cafe com leite em copo alto", "price": 1.20, "category_id": cat_map["Cafetaria"], "image_url": "", "available": True, "featured": False, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Cappuccino", "description": "Cappuccino cremoso com espuma de leite", "price": 2.00, "category_id": cat_map["Cafetaria"], "image_url": "", "available": True, "featured": False, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Sumo de Laranja Natural", "description": "Sumo de laranja espremido na hora", "price": 2.50, "category_id": cat_map["Bebidas"], "image_url": "", "available": True, "featured": False, "created_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.menu_items.insert_many(items)
        logger.info("Menu data seeded")
    
    # Seed gallery if empty
    gallery_count = await db.gallery.count_documents({})
    if gallery_count == 0:
        gallery_items = [
            {"id": str(uuid.uuid4()), "image_url": "https://images.unsplash.com/photo-1764486601113-a6856cdce5fd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYWtlcnklMjBzdG9yZWZyb250fGVufDB8fHx8MTc3NTI0Mzk5OXww&ixlib=rb-4.1.0&q=85", "caption": "A nossa fachada", "order": 1, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "image_url": "https://images.unsplash.com/photo-1587288672797-74093d795afc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHx3YXJtJTIwY2FmZSUyMGludGVyaW9yJTIwd29vZHxlbnwwfHx8fDE3NzUyNDM5Nzh8MA&ixlib=rb-4.1.0&q=85", "caption": "Interior acolhedor", "order": 2, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "image_url": "https://images.unsplash.com/photo-1771835101104-654333861d53?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxwb3J0dWd1ZXNlJTIwcGFzdGVsJTIwZGUlMjBuYXRhJTIwY29mZmVlfGVufDB8fHx8MTc3NTI0Mzk3OHww&ixlib=rb-4.1.0&q=85", "caption": "Pasteis de nata frescos", "order": 3, "created_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.gallery.insert_many(gallery_items)
        logger.info("Gallery data seeded")
    
    # Write test credentials
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"# Test Credentials\n\n")
        f.write(f"## Admin\n- Email: {admin_email}\n- Password: {admin_password}\n- Role: admin\n\n")
        f.write(f"## Endpoints\n- Login: POST /api/auth/login\n- Me: GET /api/auth/me\n- Logout: POST /api/auth/logout\n")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
