from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from gensim.models import Word2Vec
import os
import re

app = Flask(__name__)
CORS(app)

# Cấu hình PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://danglinh:123456@localhost:5433/linhDB'
db = SQLAlchemy(app)

# Khai báo bảng CSDL
class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String)
    description = db.Column(db.String)
    avatar = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    category = db.relationship('Category', backref='products', lazy=True)

# Load mô hình
MODEL_PATH = "model/word2vec.model"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Không tìm thấy model tại {MODEL_PATH}")
model = Word2Vec.load(MODEL_PATH)
print("Mô hình Word2Vec đã được load thành công.")

# Danh sách stop words
stop_words = {"the", "of", "for", "and", "with", "included", "bundle", "kit", "system", "color"}

# API
@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        raw_keyword = str(data.get("keyword", "")).lower().strip()
        if not raw_keyword:
            return jsonify([])

        # Làm sạch từ khóa
        keyword = re.sub(r'[^\w\s]', '', raw_keyword)
        tokens = keyword.split()
        similar_words = set(token for token in tokens if token not in stop_words)

        for token in tokens:
            if token in model.wv:
                similar = model.wv.most_similar(token, topn=5)
                filtered = [w[0] for w in similar if w[0].isalpha() and len(w[0]) < 20 and w[0] not in stop_words]
                similar_words.update(filtered)

        print(f"\nTừ tương tự với '{raw_keyword}': {list(similar_words)}")
        print(f"Đang tìm sản phẩm chứa các từ khóa: {similar_words}")

        all_products = Product.query.all()
        scored = []

        for p in all_products:
            name = (p.product_name or '').lower()
            desc = (p.description or '').lower()
            category = (p.category.name or '').lower() if p.category else ""

            score = sum(word in name or word in desc or word in category for word in similar_words)
            if score > 0:
                scored.append((score, {
                    "id": p.id,
                    "productName": p.product_name,
                    "description": p.description,
                    "avatar": p.avatar,
                    "category": {
                        "id": p.category.id,
                        "name": p.category.name
                    } if p.category else None
                }))

        # Sắp xếp theo điểm liên quan
        scored.sort(key=lambda x: x[0], reverse=True)
        recommendations = [item[1] for item in scored[:8]]

        # Fallback nếu không có kết quả
        if not recommendations:
            print("Không có kết quả phù hợp, trả fallback")
            for p in all_products[:5]:
                recommendations.append({
                    "id": p.id,
                    "productName": p.product_name,
                    "description": p.description,
                    "avatar": p.avatar,
                    "category": {
                        "id": p.category.id,
                        "name": p.category.name
                    } if p.category else None
                })

        else:
            print("Sản phẩm gợi ý:")
            for r in recommendations:
                print(f"- [{r['id']}] {r['productName']} — {r['category']['name'] if r['category'] else 'No category'}")

        return jsonify(recommendations)

    except Exception as e:
        print("Lỗi trong recommend:", e)
        return jsonify([])

# Chạy server
if __name__ == "__main__":
    app.run(debug=True)
