
import pandas as pd
from gensim.models import Word2Vec
import os
import re

# Đọc dữ liệu sản phẩm
print("Đang đọc dữ liệu sản phẩm...")
df = pd.read_csv('electronics_cleaned.csv')
print(f"Đã đọc {len(df)} dòng dữ liệu")

# Làm sạch dữ liệu:
def clean_text(text):
    if pd.isna(text):
        return ""
    text = text.lower()                      
    text = re.sub(r'[^\w\s]', '', text)     
    text = re.sub(r'\s+', ' ', text).strip() 
    return text

df['keyword'] = df['productName'].apply(clean_text)

# Tách từ khóa thành câu
sentences = df['keyword'].apply(str.split).tolist()
print(f"Tổng số câu huấn luyện: {len(sentences)}")

# Huấn luyện mô hình
print("Đang huấn luyện mô hình Word2Vec...")
model = Word2Vec(sentences, vector_size=100, window=5, min_count=1, sg=1)

# Lưu mô hình ra file
os.makedirs("model", exist_ok=True)
model.save("model/word2vec.model")
print("Mô hình Word2Vec đã được huấn luyện và lưu thành công.")