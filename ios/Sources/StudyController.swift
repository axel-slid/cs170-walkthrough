import SwiftUI
import WebKit

/// Hosts the walkthrough web app (renderer/ + content/, bundled as-is) and stands in for
/// Electron's preload bridge: `window.study` reads and writes progress through this class.
final class StudyController: NSObject, ObservableObject, WKScriptMessageHandler, UIPencilInteractionDelegate {
    static let scheme = "cs170"

    lazy var webView: WKWebView = makeWebView()

    /// One pencil for the Paper and the page (see PaperTools).
    let tools = PaperTools()

    override init() {
        super.init()
        tools.onChange = { [weak self] tool, color in
            self?.webView.evaluateJavaScript("window.__ink && window.__ink('sync', { tool: '\(tool)', color: \(color) })")
        }
    }

    /// Scratch paper for the part the page is showing (see Paper.swift).
    @Published var paperOpen = false {
        didSet {
            webView.evaluateJavaScript("window.__setPaperOpen && window.__setPaperOpen(\(paperOpen))")
            // Closing the Paper sends a visiting pet home.
            if !paperOpen, let pet = paperPet { returnPet(edge: pet.edge, at: 0.6) }
        }
    }
    /// The page's pet while it's visiting the Paper (see PaperPet.swift).
    @Published private(set) var paperPet: PaperPetData?

    func returnPet(edge: String, at: Double) {
        paperPet = nil
        webView.evaluateJavaScript("window.__petFromPaper && window.__petFromPaper('\(edge == "bottom" ? "bottom" : "right")', \(max(0, min(1, at))))")
    }
    /// The page's accent color (from the shop/theme), so native controls match it.
    @Published private(set) var accent = Color(red: 0.43, green: 0.66, blue: 0.97)
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
          setTheme: (theme) => window.webkit.messageHandlers.theme.postMessage(theme),
          setAccent: (color) => window.webkit.messageHandlers.accent.postMessage(color),
          petToPaper: (json) => window.webkit.messageHandlers.pet.postMessage(json),
          setPencil: (t) => window.webkit.messageHandlers.pencil.postMessage(t),
          effect: (name) => window.webkit.messageHandlers.effect.postMessage(name),
          exportPDF: (html, name) => new Promise((resolve) => {
            window.__pdfDone = resolve;
            window.webkit.messageHandlers.pdf.postMessage({ html, name });
          }),
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
        controller.add(WeakMessageHandler(self), name: "pdf")
        controller.add(WeakMessageHandler(self), name: "theme")
        controller.add(WeakMessageHandler(self), name: "accent")
        controller.add(WeakMessageHandler(self), name: "pet")
        controller.add(WeakMessageHandler(self), name: "pencil")
        controller.add(WeakMessageHandler(self), name: "effect")

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
        #if DEBUG
        // Screenshots: `simctl launch … --js <base64>` runs a setup script once the page is up.
        let args = CommandLine.arguments
        if let i = args.firstIndex(of: "--js"), i + 1 < args.count,
           let data = Data(base64Encoded: args[i + 1]), let js = String(data: data, encoding: .utf8) {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) { [weak view] in view?.evaluateJavaScript(js) }
        }
        // Layout check for test mode: `simctl launch … --pdf-selftest` takes a test and exports it.
        if CommandLine.arguments.contains("--pdf-selftest") {
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) { [weak view] in
                view?.evaluateJavaScript("""
                (async () => {
                  const W = (ms) => new Promise((r) => setTimeout(r, ms));
                  document.getElementById('test-btn').click(); await W(300);
                  [...document.querySelectorAll('.btn.primary')].find((b) => b.textContent === 'Start test').click(); await W(300);
                  const f = document.querySelector('.test-answer textarea, .test-answer input');
                  if (f) { f.value = 'Self-test answer'; f.dispatchEvent(new Event('input')); }
                  document.getElementById('test-submit').click(); await W(300);
                  [...document.querySelectorAll('.test-confirm .btn')].find((b) => b.textContent.startsWith('Submit')).click(); await W(500);
                  [...document.querySelectorAll('.btn')].find((b) => b.textContent.startsWith('Export PDF')).click();
                })();
                """)
            }
        }
        #endif
        return view
    }

    /// Runs a menu command in the page (same channels as the Electron menu).
    func send(_ command: String) {
        webView.evaluateJavaScript("window.__studyCommand && window.__studyCommand('\(command)')")
    }

    private var squeezing = false
    private var pdfJob: PDFExporter?

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
        case "effect":
            guard let name = message.body as? String, let window = webView.window else { return }
            FullScreenEffects.play(name, in: window)
        case "pencil":
            guard let body = message.body as? [String: Any], let tool = body["tool"] as? String else { return }
            tools.sync(tool: tool, color: (body["color"] as? Int) ?? tools.inkColorIndex)
        case "pet":
            guard let json = message.body as? String else { return }
            paperPet = json == "null" ? nil : try? JSONDecoder().decode(PaperPetData.self, from: Data(json.utf8))
        case "accent":
            // "#rrggbb" from the page's --accent.
            guard let hex = (message.body as? String)?.trimmingCharacters(in: .whitespaces).dropFirst(),
                  hex.count == 6, let v = UInt32(hex, radix: 16) else { return }
            accent = Color(red: Double((v >> 16) & 0xff) / 255, green: Double((v >> 8) & 0xff) / 255, blue: Double(v & 0xff) / 255)
        case "theme":
            // Light/Dark from Settings: applies to the whole app, including the Paper panel.
            let style: UIUserInterfaceStyle = switch message.body as? String {
            case "light": .light
            case "dark": .dark
            default: .unspecified
            }
            for scene in UIApplication.shared.connectedScenes {
                for window in (scene as? UIWindowScene)?.windows ?? [] { window.overrideUserInterfaceStyle = style }
            }
        case "pdf":
            guard let body = message.body as? [String: Any], let html = body["html"] as? String,
                  let name = body["name"] as? String else { return }
            let job = PDFExporter(html: html, name: name, host: webView) { [weak self] ok in
                self?.webView.evaluateJavaScript("window.__pdfDone && window.__pdfDone({ ok: \(ok) })")
                self?.pdfJob = nil
            }
            pdfJob = job
            job.start()
        default:
            break
        }
    }
}

/// Turns a finished test (HTML built by the page) into a paginated letter-size PDF, then
/// offers it through the share sheet (Claude, Files, AirDrop, Mail…).
final class PDFExporter: NSObject, WKNavigationDelegate {
    private let html: String
    private let name: String
    private weak var host: WKWebView?
    private let done: (Bool) -> Void
    private var web: WKWebView?

    init(html: String, name: String, host: WKWebView, done: @escaping (Bool) -> Void) {
        self.html = html
        self.name = name
        self.host = host
        self.done = done
    }

    func start() {
        let config = WKWebViewConfiguration()
        config.setURLSchemeHandler(BundleSchemeHandler(), forURLScheme: StudyController.scheme)
        let web = WKWebView(frame: CGRect(x: 0, y: 0, width: 612, height: 792), configuration: config)
        web.navigationDelegate = self
        web.alpha = 0.01 // laid out and rendered, but not visible
        web.isUserInteractionEnabled = false
        host?.addSubview(web)
        self.web = web
        web.loadHTMLString(html, baseURL: URL(string: "\(StudyController.scheme)://app/renderer/"))
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [self] in render() }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        NSLog("PDFExporter: load failed: \(error)")
        finish(nil)
    }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        NSLog("PDFExporter: provisional load failed: \(error)")
        finish(nil)
    }

    private func render() {
        guard let web else { return finish(nil) }
        let renderer = UIPrintPageRenderer()
        renderer.addPrintFormatter(web.viewPrintFormatter(), startingAtPageAt: 0)
        let paper = CGRect(x: 0, y: 0, width: 612, height: 792) // US letter, in points
        renderer.setValue(NSValue(cgRect: paper), forKey: "paperRect")
        renderer.setValue(NSValue(cgRect: paper.insetBy(dx: 43, dy: 40)), forKey: "printableRect")
        let data = NSMutableData()
        UIGraphicsBeginPDFContextToData(data, paper, nil)
        renderer.prepare(forDrawingPages: NSRange(location: 0, length: renderer.numberOfPages))
        for page in 0..<renderer.numberOfPages {
            UIGraphicsBeginPDFPage()
            renderer.drawPage(at: page, in: UIGraphicsGetPDFContextBounds())
        }
        UIGraphicsEndPDFContext()
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(name)
        do {
            try (data as Data).write(to: url, options: .atomic)
            finish(url)
        } catch {
            NSLog("PDFExporter: write failed: \(error)")
            finish(nil)
        }
    }

    private func finish(_ url: URL?) {
        web?.removeFromSuperview()
        web = nil
        guard let url, let host, var top = host.window?.rootViewController else {
            NSLog("PDFExporter: nothing to share (url \(url != nil), window \(self.host?.window != nil))")
            return done(false)
        }
        while let next = top.presentedViewController { top = next }
        let share = UIActivityViewController(activityItems: [url], applicationActivities: nil)
        share.popoverPresentationController?.sourceView = host
        share.popoverPresentationController?.sourceRect = CGRect(x: host.bounds.maxX - 180, y: 70, width: 1, height: 1)
        top.present(share, animated: true)
        done(true)
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
        "jpg": "image/jpeg", "jpeg": "image/jpeg", "webp": "image/webp",
        "mjs": "text/javascript", "woff2": "font/woff2"
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
