import webview
import os
import sys
import tkinter as tk
from tkinter import filedialog

class Api:
    def save_csv(self, csv_content, default_name):
        # 隱藏 root 視窗
        root = tk.Tk()
        root.withdraw()
        root.attributes("-topmost", True) # 讓視窗置頂

        # 彈出原生「另存新檔」視窗
        file_path = filedialog.asksaveasfilename(
            title="儲存織夢紀錄",
            initialfile=default_name,
            defaultextension=".csv",
            filetypes=[("CSV Files", "*.csv"), ("All Files", "*.*")]
        )
        
        root.destroy()

        if not file_path:
            return {"success": False, "canceled": True}

        try:
            # 寫入檔案 (使用 utf-8-sig 避免 Excel 亂碼)
            with open(file_path, 'w', encoding='utf-8-sig', newline='') as f:
                f.write(csv_content)
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

def get_resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

if __name__ == '__main__':
    html_path = get_resource_path('dice_machine.html')
    api = Api()
    
    # 1400x787 是接近 16:9 的比例，適合大多數筆電
    window = webview.create_window(
        title='織夢者菲特《Fate》',
        url=html_path,
        js_api=api,
        width=1400,
        height=787,
        resizable=True,
        fullscreen=False
    )
    
    webview.start(debug=False)