import SwiftUI
import WebKit

/// Hosts the walkthrough web app (renderer/ + content/, bundled as-is) and stands in for
/// Electron's preload bridge: `window.study` reads and writes progress through this class.
final class StudyController: NSObject, ObservableObject, WKScriptMessageHandler, UIPencilInteractionDelegate {
    static let scheme = "cs170"

    lazy var webView: WKWebView = makeWebView()

    /// Scratch paper for the part the page is showing (see Paper.swift).
    @Published var paperOpen = false {
        didSet { webView.evaluateJavaScript("window.__setPaperOpen && window.__setPaperOpen(\(paperOpen))") }
    }
    @Published private(set) var paperKey = ""
    @Published private(set) var paperLabel = ""

    private let progressURL: URL = {
        let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir.appendingPathComponent("progress.json")
    }()

    /// Saved progress as a JSON object literal, or `{}` if there is none or it doesn't parse.
    private func savedProgressJSON() -> String {
        guard let data = try? Data(contentsOf: progressURL),
              (try? JSONSerialization.jsonObject(with: data)) is [String: Any],
              let text = String(data: data, encoding: .utf8)
        else { return "{}" }
        return text
    }

    private func makeWebView() -> WKWebView {
        let config = WKWebViewConfiguration()
        config.setURLSchemeHandler(BundleSchemeHandler(), forURLScheme: Self.scheme)

        let bridge = """
        document.documentElement.classList.add('ios');
        window.study = {
          readProgress: () => Promise.resolve(\(savedProgressJSON())),
          writeProgress: (data) => {
            window.webkit.messageHandlers.progress.postMessage(JSON.stringify(data));
            return Promise.resolve();
          },
          onCommand: (handler) => { window.__studyCommand = handler; },
          paper: {
            toggle: () => window.webkit.messageHandlers.paper.postMessage({ action: 'toggle' }),
            position: (key, label) => window.webkit.messageHandlers.paper.postMessage({ action: 'position', key, label })
          }
        };
        """
        let controller = config.userContentController
        controller.addUserScript(WKUserScript(source: bridge, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        controller.add(WeakMessageHandler(self), name: "progress")
        controller.add(WeakMessageHandler(self), name: "paper")

        let view = WKWebView(frame: .zero, configuration: config)
        view.isOpaque = false
        view.backgroundColor = .systemBackground
        // The page scrolls its own panes. The outer view stays put so the layout never drifts.
        view.scrollView.isScrollEnabled = false
        view.scrollView.contentInsetAdjustmentBehavior = .never
        #if DEBUG
        view.isInspectable = true
        #endif
        // Pencil double-tap and squeeze control the eraser for ink written on the page.
        view.addInteraction(UIPencilInteraction(delegate: self))
        view.load(URLRequest(url: URL(string: "\(Self.scheme)://app/renderer/index.html")!))
        return view
    }

    /// Runs a menu command in the page (same channels as the Electron menu).
    func send(_ command: String) {
        webView.evaluateJavaScript("window.__studyCommand && window.__studyCommand('\(command)')")
    }

    private var squeezing = false

    func pencilInteraction(_ interaction: UIPencilInteraction, didReceiveTap tap: UIPencilInteraction.Tap) {
        guard !paperOpen else { return } // the Paper panel handles its own gestures
        webView.evaluateJavaScript("window.__ink && window.__ink('toggle-eraser')")
    }

    func pencilInteraction(_ interaction: UIPencilInteraction, didReceiveSqueeze squeeze: UIPencilInteraction.Squeeze) {
        guard !paperOpen else { return }
        let on = squeeze.phase == .began || squeeze.phase == .changed
        guard on != squeezing else { return }
        squeezing = on
        webView.evaluateJavaScript("window.__ink && window.__ink('\(on ? "squeeze-on" : "squeeze-off")')")
    }

    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        switch message.name {
        case "progress":
            guard let text = message.body as? String else { return }
            try? Data(text.utf8).write(to: progressURL, options: .atomic)
        case "paper":
            guard let body = message.body as? [String: Any], let action = body["action"] as? String else { return }
            if action == "toggle" {
                paperOpen.toggle()
            } else if action == "position", let key = body["key"] as? String, let label = body["label"] as? String {
                paperKey = key
                paperLabel = label
                #if DEBUG
                // Screenshots and layout checks: `simctl launch … --open-paper`.
                if CommandLine.arguments.contains("--open-paper"), !paperOpen { paperOpen = true }
                #endif
            }
        default:
            break
        }
    }
}

/// Avoids the retain cycle between WKUserContentController and its handler.
private final class WeakMessageHandler: NSObject, WKScriptMessageHandler {
    weak var target: WKScriptMessageHandler?
    init(_ target: WKScriptMessageHandler) { self.target = target }
    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        target?.userContentController(controller, didReceive: message)
    }
}

/// Serves bundled files at cs170://app/<path>. A real scheme (not file://) lets the page load
/// its ES modules, which WebKit refuses to import from file URLs.
private final class BundleSchemeHandler: NSObject, WKURLSchemeHandler {
    private static let types = [
        "html": "text/html", "js": "text/javascript", "css": "text/css",
        "json": "application/json", "svg": "image/svg+xml", "png": "image/png",
        "jpg": "image/jpeg", "jpeg": "image/jpeg", "webp": "image/webp"
    ]

    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        guard let url = task.request.url, let root = Bundle.main.resourceURL?.standardizedFileURL else {
            task.didFailWithError(URLError(.badURL))
            return
        }
        let file = root.appendingPathComponent(String(url.path.dropFirst())).standardizedFileURL
        guard file.path.hasPrefix(root.path + "/"), let data = try? Data(contentsOf: file) else {
            task.didFailWithError(URLError(.fileDoesNotExist))
            return
        }
        let type = Self.types[file.pathExtension.lowercased()] ?? "application/octet-stream"
        let response = HTTPURLResponse(
            url: url, statusCode: 200, httpVersion: "HTTP/1.1",
            headerFields: ["Content-Type": "\(type); charset=utf-8", "Content-Length": "\(data.count)"]
        )!
        task.didReceive(response)
        task.didReceive(data)
        task.didFinish()
    }

    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {}
}

struct StudyWebView: UIViewRepresentable {
    let controller: StudyController
    func makeUIView(context: Context) -> WKWebView { controller.webView }
    func updateUIView(_ view: WKWebView, context: Context) {}
}
