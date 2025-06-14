import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import re
from collections import Counter

# Đọc dữ liệu
df = pd.read_csv("electronics_cleaned.csv")

# Làm sạch dữ liệu
df["category"] = df["category"].fillna("Khác")
df["productName"] = df["productName"].fillna("")

def plot_top_keywords():
    def clean_words(text):
        text = str(text).lower()
        text = re.sub(r'[^\w\s]', '', text)
        return text.split()

    words = df["productName"].dropna().apply(clean_words).sum()
    top_words = Counter(words).most_common(15)

    labels, values = zip(*top_words)
    plt.figure(figsize=(10, 5))
    sns.barplot(x=labels, y=values)
    plt.title("Từ khóa phổ biến trong tên sản phẩm")
    plt.xlabel("Từ khóa")
    plt.ylabel("Tần suất")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    print("Đang tạo biểu đồ...")
    plot_top_keywords()
    print("Đã hiển thị xong tất cả biểu đồ.")
