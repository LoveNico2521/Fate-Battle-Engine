import os
import webview

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
    html_path = os.path.abspath('index_classic.html')
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