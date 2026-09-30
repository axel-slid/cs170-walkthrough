import PencilKit
import SwiftUI
import UIKit

// Apple Pencil scratch paper, one sheet per exam part.
// The canvas, tool handling, and storage are adapted from ~/cs170-study's PencilPageView and
// StudyModels, which were tested on this iPad (squeeze/double-tap, dark-mode ink, zoom).

/// Pen, highlighter or eraser and the ink color: one pencil for the Paper and for writing on
/// the page. `onChange` tells the page when the Paper's toolbar (or a Pencil double-tap on the
/// Paper) changes it; `sync` takes changes the other way without echoing them back.
final class PaperTools: ObservableObject {
    @Published var isEraser = false
    @Published var isHighlighter = false
    var onChange: ((String, Int) -> Void)?
    @Published private(set) var isSqueezing = false
    @Published var inkColorIndex = 0
    weak var activeCanvas: PKCanvasView?

    let inkColors: [UIColor] = [
        .black,
        UIColor(red: 0.15, green: 0.39, blue: 0.92, alpha: 1),
        UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1),
        UIColor(red: 0.09, green: 0.64, blue: 0.29, alpha: 1),
        UIColor(red: 0.58, green: 0.20, blue: 0.92, alpha: 1),
        UIColor(red: 0.92, green: 0.46, blue: 0.08, alpha: 1)
    ]
    let colorNames = ["Black", "Blue", "Red", "Green", "Purple", "Orange"]

    var isUsingEraser: Bool { isEraser || isSqueezing }
    /// The highlighter's yellow, the same as the page's (renderer/ink.js).
    let highlightColor = UIColor(red: 0.98, green: 0.80, blue: 0.08, alpha: 1)

    var currentTool: PKTool {
        if isUsingEraser { return PKEraserTool(.vector) }
        if isHighlighter { return PKInkingTool(.marker, color: highlightColor, width: 18) }
        return PKInkingTool(.pen, color: inkColors[inkColorIndex], width: 3)
    }

    var toolName: String { isEraser ? "eraser" : isHighlighter ? "highlighter" : "pen" }

    func toggleEraser() {
        isSqueezing = false
        isEraser.toggle()
        if isEraser { isHighlighter = false }
        applyTool()
        onChange?(toolName, inkColorIndex)
    }

    func toggleHighlighter() {
        isHighlighter.toggle()
        isEraser = false
        applyTool()
        onChange?(toolName, inkColorIndex)
    }

    /// A change made on the page.
    func sync(tool: String, color: Int) {
        inkColorIndex = max(0, min(inkColors.count - 1, color))
        isEraser = tool == "eraser"
        isHighlighter = tool == "highlighter"
        applyTool()
    }

    // Press/release sets the mode instead of toggling it, so repeated
    // changed events cannot leave the pen stuck in erase mode.
    func handleSqueeze(_ phase: UIPencilInteraction.Phase) {
        switch phase {
        case .began, .changed:
            if isEraser { isEraser = false }
            if !isSqueezing { isSqueezing = true }
            applyTool()
        default:
            if isSqueezing { isSqueezing = false }
            if isEraser { isEraser = false }
            applyTool()
        }
    }

    /// Wipes the sheet that's showing. Undo brings the writing back.
    func clearPaper() {
        guard let canvas = activeCanvas, !canvas.drawing.strokes.isEmpty else { return }
        setDrawing(PKDrawing(), on: canvas)
        canvas.undoManager?.setActionName("Clear Paper")
    }

    private func setDrawing(_ drawing: PKDrawing, on canvas: PKCanvasView) {
        let old = canvas.drawing
        canvas.undoManager?.registerUndo(withTarget: canvas) { [weak self] canvas in
            self?.setDrawing(old, on: canvas)
        }
        canvas.drawing = drawing // the delegate saves the change
    }

    func selectColor(_ index: Int) {
        inkColorIndex = index
        isEraser = false
        isHighlighter = false
        applyTool()
        onChange?(toolName, inkColorIndex)
    }

    private func applyTool() {
        activeCanvas?.tool = currentTool
        activeCanvas?.isDrawingEnabled = true
        activeCanvas?.drawingGestureRecognizer.isEnabled = true
    }
}

/// Saves each sheet as a PKDrawing file, plus how tall the sheet has grown.
final class PaperStore {
    private let directory: URL = {
        let root = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        let dir = root.appendingPathComponent("Paper", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir
    }()

    private func url(for key: String) -> URL {
        let safe = key.filter { $0.isLetter || $0.isNumber || $0 == "-" }
        return directory.appendingPathComponent(safe + ".drawing")
    }

    func drawing(for key: String) -> PKDrawing {
        guard let data = try? Data(contentsOf: url(for: key)),
              let drawing = try? PKDrawing(data: data) else { return PKDrawing() }
        return drawing
    }

    func save(_ drawing: PKDrawing, for key: String) {
        try? drawing.dataRepresentation().write(to: url(for: key), options: .atomic)
    }

    func height(for key: String, pageHeight: CGFloat) -> CGFloat {
        max(pageHeight * 2, UserDefaults.standard.double(forKey: "paper-height-\(key)"))
    }

    func saveHeight(_ height: CGFloat, for key: String) {
        UserDefaults.standard.set(Double(height), forKey: "paper-height-\(key)")
    }
}

/// Paper color: white in light mode, near-black in dark mode. PencilKit flips ink to match
/// (black ink draws light on dark paper), and the saved drawing keeps its original colors.
private let paperColor = UIColor { $0.userInterfaceStyle == .dark
    ? UIColor(red: 0.11, green: 0.11, blue: 0.12, alpha: 1)
    : .white }

/// The page toolbar's colors (renderer/styles.css: --bar-bg and --hairline), so the Paper's
/// header lines up with it as one bar.
private let toolbarColor = UIColor { $0.userInterfaceStyle == .dark
    ? UIColor(red: 0x26 / 255, green: 0x26 / 255, blue: 0x2a / 255, alpha: 1)
    : UIColor(red: 0xf7 / 255, green: 0xf7 / 255, blue: 0xf9 / 255, alpha: 1) }
private let hairlineColor = UIColor { $0.userInterfaceStyle == .dark
    ? UIColor(red: 0x37 / 255, green: 0x37 / 255, blue: 0x3c / 255, alpha: 1)
    : UIColor(red: 0xe2 / 255, green: 0xe1 / 255, blue: 0xe6 / 255, alpha: 1) }

/// Paper under a PencilKit canvas. PencilKit owns the viewport and zoom, so ink is never
/// enlarged by a parent scroll view; the paper underlay just follows the canvas geometry.
final class PaperCanvasView: UIView {
    static let pageSize = CGSize(width: 612, height: 792)

    let pageContent = UIView()
    let canvas = PKCanvasView()
    private var fittedWidth: CGFloat = 0
    var zoomScale: CGFloat { canvas.zoomScale }

    func configure(height: CGFloat) {
        backgroundColor = paperColor
        clipsToBounds = true
        pageContent.bounds = CGRect(origin: .zero, size: CGSize(width: Self.pageSize.width, height: height))
        pageContent.backgroundColor = paperColor
        pageContent.isUserInteractionEnabled = false
        addSubview(pageContent)

        canvas.frame = bounds
        canvas.contentSize = pageContent.bounds.size
        canvas.contentInsetAdjustmentBehavior = .never
        canvas.delaysContentTouches = false
        canvas.panGestureRecognizer.allowedTouchTypes = [NSNumber(value: UITouch.TouchType.direct.rawValue)]
        canvas.showsHorizontalScrollIndicator = false
        canvas.alwaysBounceVertical = true
        canvas.bouncesZoom = true
        canvas.backgroundColor = .clear
        canvas.isOpaque = false
        canvas.drawingPolicy = .pencilOnly // fingers scroll and zoom; the Pencil writes
        canvas.isScrollEnabled = true
        if #available(iOS 26.0, *) {
            canvas.pencilKitResponderState.toolPickerVisibility = .inactive
        }
        canvas.isDrawingEnabled = true
        canvas.drawingGestureRecognizer.isEnabled = true
        canvas.accessibilityIdentifier = "scratch-paper"
        addSubview(canvas)
        setNeedsLayout()
        layoutIfNeeded()
        syncPaper()
    }

    func syncPaper() {
        let scale = canvas.zoomScale
        pageContent.transform = CGAffineTransform(scaleX: scale, y: scale)
        pageContent.center = CGPoint(x: pageContent.bounds.width * scale / 2 - canvas.contentOffset.x,
                                     y: pageContent.bounds.height * scale / 2 - canvas.contentOffset.y)
    }

    func extendPaper(to height: CGFloat) {
        guard height > pageContent.bounds.height else { return }
        pageContent.bounds.size.height = height
        canvas.contentSize = CGSize(width: pageContent.bounds.width * zoomScale, height: height * zoomScale)
        syncPaper()
    }

    func activateDrawing() {
        canvas.becomeFirstResponder()
        canvas.isDrawingEnabled = true
        canvas.drawingGestureRecognizer.isEnabled = true
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        canvas.frame = bounds
        let width = bounds.width
        if width > 0, abs(width - fittedWidth) > 0.5 {
            let fit = width / pageContent.bounds.width
            fittedWidth = width
            canvas.maximumZoomScale = fit * 4
            canvas.minimumZoomScale = fit
            canvas.zoomScale = fit
            canvas.contentSize = CGSize(width: pageContent.bounds.width * fit, height: pageContent.bounds.height * fit)
            canvas.contentOffset = .zero
        }
        syncPaper()
    }
}

struct PaperView: UIViewRepresentable {
    let key: String
    @ObservedObject var tools: PaperTools
    let store: PaperStore

    func makeCoordinator() -> Coordinator { Coordinator(key: key, tools: tools, store: store) }

    func makeUIView(context: Context) -> PaperCanvasView {
        let view = PaperCanvasView()
        view.configure(height: store.height(for: key, pageHeight: PaperCanvasView.pageSize.height))
        view.canvas.delegate = context.coordinator
        view.canvas.drawing = store.drawing(for: key)
        view.canvas.tool = tools.currentTool
        view.canvas.addInteraction(UIPencilInteraction(delegate: context.coordinator))
        context.coordinator.canvas = view.canvas
        context.coordinator.paper = view
        tools.activeCanvas = view.canvas
        DispatchQueue.main.async { [weak view] in view?.activateDrawing() }
        return view
    }

    func updateUIView(_ view: PaperCanvasView, context: Context) {
        view.canvas.tool = tools.currentTool
        view.canvas.isDrawingEnabled = true
        view.canvas.drawingGestureRecognizer.isEnabled = true
    }

    final class Coordinator: NSObject, PKCanvasViewDelegate, UIPencilInteractionDelegate {
        let key: String
        let tools: PaperTools
        let store: PaperStore
        weak var canvas: PKCanvasView?
        weak var paper: PaperCanvasView?

        init(key: String, tools: PaperTools, store: PaperStore) {
            self.key = key
            self.tools = tools
            self.store = store
        }

        func scrollViewDidZoom(_ scrollView: UIScrollView) { paper?.syncPaper() }

        func scrollViewDidScroll(_ scrollView: UIScrollView) {
            guard let paper else { return }
            paper.syncPaper()
            let size = scrollView.contentSize
            guard paper.zoomScale > 0, size.height > paper.bounds.height,
                  scrollView.contentOffset.y + paper.bounds.height > size.height - 160 else { return }
            extend(paper)
        }

        func canvasViewDrawingDidChange(_ canvasView: PKCanvasView) {
            store.save(canvasView.drawing, for: key)
            // Writing near the bottom adds another page's worth of paper.
            if let paper, canvasView.drawing.bounds.maxY > paper.pageContent.bounds.height - 160 {
                extend(paper)
            }
        }

        private func extend(_ paper: PaperCanvasView) {
            let height = paper.pageContent.bounds.height + PaperCanvasView.pageSize.height
            paper.extendPaper(to: height)
            store.saveHeight(height, for: key)
        }

        func canvasViewDidBeginUsingTool(_ canvasView: PKCanvasView) {
            tools.activeCanvas = canvasView
        }

        func pencilInteraction(_ interaction: UIPencilInteraction, didReceiveTap tap: UIPencilInteraction.Tap) {
            guard canvas === tools.activeCanvas, canvas?.window != nil else { return }
            tools.toggleEraser()
        }

        func pencilInteraction(_ interaction: UIPencilInteraction, didReceiveSqueeze squeeze: UIPencilInteraction.Squeeze) {
            guard canvas === tools.activeCanvas, canvas?.window != nil else { return }
            tools.handleSqueeze(squeeze.phase)
        }
    }
}

/// The paper plus its small toolbar.
struct PaperPane: View {
    let key: String
    let label: String
    let accent: Color
    @ObservedObject var tools: PaperTools
    let store: PaperStore
    let onClose: () -> Void
    @State private var confirmingClear = false

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 10) {
                Text("Paper").font(.headline)
                Spacer(minLength: 8)
                Button { tools.toggleHighlighter() } label: {
                    Image(systemName: "highlighter")
                        .frame(width: 30, height: 30)
                        .background(tools.isHighlighter ? accent.opacity(0.18) : .clear, in: RoundedRectangle(cornerRadius: 7))
                }
                .accessibilityLabel(tools.isHighlighter ? "Back to the pen" : "Highlighter")
                Button { tools.toggleEraser() } label: {
                    Image(systemName: tools.isUsingEraser ? "eraser.fill" : "eraser")
                        .frame(width: 30, height: 30)
                        .background(tools.isUsingEraser ? accent.opacity(0.18) : .clear, in: RoundedRectangle(cornerRadius: 7))
                }
                .accessibilityLabel(tools.isUsingEraser ? "Back to the pen" : "Eraser")
                Button { tools.activeCanvas?.undoManager?.undo() } label: {
                    Image(systemName: "arrow.uturn.backward").frame(width: 30, height: 30)
                }
                .accessibilityLabel("Undo")
                Button { tools.activeCanvas?.undoManager?.redo() } label: {
                    Image(systemName: "arrow.uturn.forward").frame(width: 30, height: 30)
                }
                .accessibilityLabel("Redo")
                // Ink colors as dots: tap one to write in it.
                HStack(spacing: 7) {
                    ForEach(tools.inkColors.indices, id: \.self) { index in
                        let on = !tools.isUsingEraser && !tools.isHighlighter && tools.inkColorIndex == index
                        Button { tools.selectColor(index) } label: {
                            Circle()
                                // Black ink shows as white on dark paper, so match what's on screen.
                                .fill(index == 0 ? Color.primary : Color(uiColor: tools.inkColors[index]))
                                .frame(width: on ? 20 : 16, height: on ? 20 : 16)
                                .overlay(Circle().stroke(accent, lineWidth: 2).frame(width: 26, height: 26).opacity(on ? 1 : 0))
                                .frame(width: 26, height: 30)
                                .animation(.easeOut(duration: 0.15), value: on)
                        }
                        .accessibilityLabel("\(tools.colorNames[index]) ink")
                    }
                }
                Button { confirmingClear = true } label: {
                    Image(systemName: "trash").frame(width: 30, height: 30)
                }
                .accessibilityLabel("Clear paper")
                .confirmationDialog("Clear all the writing on this page?", isPresented: $confirmingClear, titleVisibility: .visible) {
                    Button("Clear Paper", role: .destructive) { tools.clearPaper() }
                    Button("Cancel", role: .cancel) {}
                } message: {
                    Text("You can bring it back with Undo.")
                }
                Button(action: onClose) {
                    Image(systemName: "xmark").frame(width: 30, height: 30)
                }
                .accessibilityLabel("Close paper")
            }
            .font(.system(size: 17))
            .tint(accent) // the app's accent color, like the page's toolbar
            .padding(.horizontal, 14)
            .frame(height: 56) // same height as the page's toolbar beside it
            .background(Color(uiColor: toolbarColor))
            Rectangle().fill(Color(uiColor: hairlineColor)).frame(height: 1)
            PaperView(key: key, tools: tools, store: store)
                .id(key) // a fresh canvas, and its saved ink, for each part
                .ignoresSafeArea(edges: .bottom) // paper runs under the home indicator
        }
    }
}
