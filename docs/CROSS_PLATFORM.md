# 🌐 跨平台指南

以 Windows 瀏覽器版為基準,其他平台的使用與打包方式。引擎本體只有一個 `index_classic.html`。

## 平台矩陣

| 平台 | 使用方式 | 擲骰 | 自動複製 | 紀錄保存 | CSV |
|---|---|---|---|---|---|
| Windows 瀏覽器 | 雙擊開啟 | ✅ crypto RNG | ✅ Clipboard API | ✅ localStorage | ✅ 下載 |
| macOS 本地 | 雙擊開啟(Safari/Chrome) | ✅ | ✅(受限情境自動退回 execCommand) | ✅ | ✅ |
| Linux 本地 | 雙擊開啟 | ✅ | ✅ | ✅ | ✅ |
| Android 瀏覽器 | 檔案開啟或區網 | ✅(無 crypto 時自動退回) | ✅(含 execCommand 後備) | ✅ | ✅ |
| iOS Safari | 檔案 App / 區網 | ✅ | ✅(含 execCommand 後備) | ✅ | ✅(存檔到檔案) |
| Android APK | Capacitor 打包,見下 | ✅ | ✅ WebView | ✅ | ✅ 原生存檔 |
| iOS App | Capacitor / Xcode,見下 | ✅ | ✅ WebView | ✅ | ✅ 原生存檔 |
| 桌面視窗版 | `main.py`(pywebview),Windows/macOS/Linux | ✅ | ✅ | ✅ | ✅ 原生存檔視窗 |

> **剪貼簿相容性**:Clipboard API 需要安全情境(https / file://)。用區網 `http://192.168.x.x` 手機連線時 API 不可用——引擎會自動退回 `execCommand('copy')`,複製功能在所有平台都可用。

## 手機直接用(不打包)

1. 電腦起伺服器:`python -m http.server 8765 --bind 0.0.0.0`(在專案目錄)
2. 手機瀏覽器開 `http://<電腦區網IP>:8765/index_classic.html`
3. 手機版面已自動適配:整頁捲動、輸入框 16px(防 iOS 自動放大)、無雙擊縮放延遲

也可以把 HTML 檔直接傳到手機,用檔案 App / 瀏覽器開啟。

## Android APK(Capacitor)

需求:Node.js、Android Studio(含 SDK)。

```bash
mkdir fate-app && cd fate-app
npm init -y
npm install @capacitor/core @capacitor/android
npx cap init "Fate Dice" "com.lovencio.fatedice" --web-dir=www
mkdir www
# 把 index_classic.html 複製進 www/ 並改名 index.html
npx cap add android
npx cap sync
npx cap open android   # Android Studio 開啟後:Build > Build APK(s)
```

產出 `android/app/build/outputs/apk/debug/app-debug.apk`。

## iOS App

**路線 A — Capacitor(有 Mac + Xcode)**:同上,把 `npx cap add android` 換成 `npx cap add ios`,Xcode 開啟後 Run 到實機/模擬器。

**路線 B — 最小 WKWebView 包裝(有 Mac + Xcode)**:

```swift
import UIKit
import WebKit

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        let webView = WKWebView(frame: view.bounds)
        view.addSubview(webView)
        let url = Bundle.main.url(forResource: "index_classic", withExtension: "html")!
        webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
    }
}
```

把 `index_classic.html` 拖進 Xcode 專案當 Bundle Resource 即可。

**免打包的折衷**:iOS Safari / Android Chrome 都支援「加入主畫面」——引擎已內建 standalone meta(`apple-mobile-web-app-capable`),從主畫面圖示啟動時是全螢幕獨立視窗,體驗接近 App。

## Linux

- 瀏覽器:雙擊開啟即可
- 桌面視窗版:`pip install pywebview`(GTK 後端需 `python3-gi` 與 `webkit2gtk`;Qt 後端裝 PyQt5 後 `webview.start(gui='qt')`)

## macOS

- 瀏覽器:雙擊開啟即可(Safari / Chrome / Firefox)
- 桌面視窗版:`pip install pywebview`(Cocoa 後端,免額外依賴);PyInstaller 打包指令同 README

## 已知平台差異

| 差異 | 說明 | 引擎處理 |
|---|---|---|
| 100vh 網址列 | iOS/Android 瀏覽器的 100vh 含網址列高度 | ≤767px 改用 `100dvh` + 整頁捲動 |
| 輸入框自動放大 | iOS Safari 對 <16px 輸入框聚焦時放大頁面 | 粗指標裝置統一 16px |
| 雙擊縮放延遲 | 觸控裝置 300ms 延遲 | `touch-action: manipulation` |
| 剪貼簿權限 | 非安全情境 Clipboard API 不存在 | `execCommand('copy')` 後備 |
| crypto 無法使用 | 非安全情境無 `getRandomValues` | 退回 `Math.random`(擲骰不中斷) |
| localStorage 禁用 | 隱私模式 / 部分 webview | 全部存取包 try-catch,關閉紀錄功能但不崩潰 |
| CSV 下載 | iOS Safari 的 download 屬性 | 開啟檔案對話框存到「檔案」App;桌面版建議用 pywebview 原生存檔 |
