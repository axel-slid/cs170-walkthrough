import PencilKit
import SwiftUI
import UIKit

// Apple Pencil scratch paper, one sheet per exam part.
// The canvas, tool handling, and storage are adapted from ~/cs170-study's PencilPageView and
// StudyModels, which were tested on this iPad (squeeze/double-tap, dark-mode ink, zoom).

/// Pen/eraser and ink color, shared by whichever sheet is showing.
final class PaperTools: ObservableObject {
    @Published var isEraser = false
    @Published private(set) var isSqueezing = false
    @Published var inkColorIndex = 0
    weak var activeCanvas: PKCanvasView?

    let inkColors: [UIColor] = [
        .black,
        UIColor(red: 0.23, green: 0.39, blue: 0.68, alpha: 1),
        UIColor(red: 0.69, green: 0.42, blue: 0.20, alpha: 1),
        UIColor(red: 0.55, green: 0.36, blue: 0.64, alpha: 1)
    ]
    let colorNames = ["Black", "Blue", "Brown", "Purple"]

    var isUsingEraser: Bool { isEraser || isSqueezing }
    var currentTool: PKTool {
        if isUsingEraser { return PKEraserTool(.vector) }
        return PKInkingTool(.pen, color: inkColors[inkColorIndex], width: 3)
    }

    func toggleEraser() {
        isSqueezing = false
        isEraser.toggle()
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

    func selectColor(_ index: Int) {
        inkColorIndex = index
        isEraser = false
        applyTool()
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
    @ObservedObject var tools: PaperTools
    let store: PaperStore
    let onClose: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 14) {
                VStack(alignment: .leading, spacing: 1) {
                    Text("Paper").font(.headline)
                    Text(label).font(.caption).foregroundStyle(.secondary)
                }
                Spacer()
                Button { tools.toggleEraser() } label: {
                    Image(systemName: tools.isUsingEraser ? "eraser.fill" : "pencil.tip")
                        .frame(width: 30, height: 30)
                }
                .accessibilityLabel(tools.isUsingEraser ? "Switch to pen" : "Switch to eraser")
                Button { tools.activeCanvas?.undoManager?.undo() } label: {
                    Image(systemName: "arrow.uturn.backward").frame(width: 30, height: 30)
                }
                .accessibilityLabel("Undo")
                Button { tools.activeCanvas?.undoManager?.redo() } label: {
                    Image(systemName: "arrow.uturn.forward").frame(width: 30, height: 30)
                }
                .accessibilityLabel("Redo")
                Menu {
                    ForEach(tools.inkColors.indices, id: \.self) { index in
                        Button { tools.selectColor(index) } label: {
                            if tools.inkColorIndex == index {
                                Label(tools.colorNames[index], systemImage: "checkmark")
                            } else {
                                Text(tools.colorNames[index])
                            }
                        }
                    }
                } label: {
                    Circle()
                        // Black ink shows as white on dark paper, so match what's on screen.
                        .fill(tools.inkColorIndex == 0 ? Color.primary : Color(uiColor: tools.inkColors[tools.inkColorIndex]))
                        .overlay(Circle().stroke(Color.secondary.opacity(0.5), lineWidth: 1))
                        .frame(width: 22, height: 22)
                        .frame(width: 30, height: 30)
                }
                .accessibilityLabel("Ink color")
                Button(action: onClose) {
                    Image(systemName: "xmark").frame(width: 30, height: 30)
                }
                .accessibilityLabel("Close paper")
            }
            .font(.system(size: 17))
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color(uiColor: .secondarySystemBackground))
            Divider()
            PaperView(key: key, tools: tools, store: store)
                .id(key) // a fresh canvas, and its saved ink, for each part
                .ignoresSafeArea(edges: .bottom) // paper runs under the home indicator
        }
    }
}
