import os
import sys
import webview

def resource_path(relative):
    # 開發環境用腳本所在目錄;PyInstaller 打包後用解壓暫存目錄 (_MEIPASS)
    base = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base, relative)

class FateApi:
    def save_csv(self, content, default_filename):
        window = webview.windows[0]
        result = window.create_file_dialog(
            webview.SAVE_DIALOG,
            directory='',
            save_filename=default_filename,
            file_types=('CSV Files (*.csv)', 'All files (*.*)')
        )
        if result:
            file_path = result if isinstance(result, str) else result[0]
            with open(file_path, 'w', encoding='utf-8-sig') as f:
                f.write(content)
            return {'success': True, 'path': file_path}
        return {'success': False}

def main():
    api = FateApi()
    html_path = resource_path('index_classic.html')
    webview.create_window(
        title='織夢者菲特《Fate》 - 安科推演系統 (Classic)',
        url=html_path,
        js_api=api,
        width=1400,
        height=900,
        resizable=True
    )
    webview.start(debug=False)

if __name__ == '__main__':
    main()
