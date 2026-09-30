import SwiftUI

@main
struct CS170WalkthroughApp: App {
    @StateObject private var study = StudyController()

    var body: some Scene {
        WindowGroup {
            StudyLayout(study: study)
                .statusBarHidden(true) // no clock or battery: nothing but the work
                .persistentSystemOverlays(.hidden)
        }
        .commands {
            // Return and Shift-Return are handled by the page itself so they still type
            // newlines in note boxes.
            CommandMenu("Study") {
                Button("Show Answer") { study.send("toggle-key") }
                    .keyboardShortcut("k", modifiers: .command)
                Button("Staff Solution") { study.send("solution") }
                    .keyboardShortcut("j", modifiers: .command)
                Button("Ink Palette") { study.send("ink") }
                    .keyboardShortcut("i", modifiers: [.command, .shift])
                Button("No-Hints Mode") { study.send("hints") }
                    .keyboardShortcut("h", modifiers: [.command, .shift])
                Button("Toggle Sidebar") { study.send("sidebar") }
                    .keyboardShortcut("\\", modifiers: .command)
                Button("Test Mode") { study.send("test") }
                    .keyboardShortcut("t", modifiers: [.command, .shift])
                Button("Settings…") { study.send("settings") }
                    .keyboardShortcut(",", modifiers: .command)
                Button(study.paperOpen ? "Hide Paper" : "Show Paper") { study.paperOpen.toggle() }
                    .keyboardShortcut("p", modifiers: [.command, .shift])
                Button("Start This Part Over") { study.send("reset-part") }
                    .keyboardShortcut(.delete, modifiers: .command)
                Divider()
                Button("Next Part") { study.send("next-part") }
                    .keyboardShortcut("]", modifiers: .command)
                Button("Previous Part") { study.send("prev-part") }
                    .keyboardShortcut("[", modifiers: .command)
                Button("Shop") { study.send("shop") }
                    .keyboardShortcut("s", modifiers: [.command, .shift])
            }
        }
    }
}

/// The walkthrough, with Apple Pencil paper beside it (landscape) or below it (portrait).
struct StudyLayout: View {
    @ObservedObject var study: StudyController
    private let store = PaperStore()
    // How much of the screen the page gets while the Paper is open (drag the divider to change).
    @AppStorage("paperSplitWide") private var splitWide = 0.58
    @AppStorage("paperSplitTall") private var splitTall = 0.5

    var body: some View {
        GeometryReader { geo in
            let wide = geo.size.width > geo.size.height
            // AnyLayout keeps the web view's identity when the iPad rotates.
            let layout = wide ? AnyLayout(HStackLayout(spacing: 0)) : AnyLayout(VStackLayout(spacing: 0))
            layout {
                StudyWebView(controller: study)
                    .ignoresSafeArea()
                    .frame(width: wide && study.paperOpen ? geo.size.width * splitWide : nil,
                           height: !wide && study.paperOpen ? geo.size.height * splitTall : nil)
                if study.paperOpen && !study.paperKey.isEmpty {
                    PaneDivider(wide: wide, accent: study.accent) { location in
                        if wide { splitWide = min(0.8, max(0.3, location.x / geo.size.width)) }
                        else { splitTall = min(0.78, max(0.22, location.y / geo.size.height)) }
                    }
                    PaperPane(key: study.paperKey, label: study.paperLabel, accent: study.accent, tools: study.tools, store: store) {
                        study.paperOpen = false
                    }
                    .overlay {
                        if let pet = study.paperPet {
                            PaperPetLayer(pet: pet) { at in study.returnPet(edge: pet.edge, at: at) }
                                .id(pet.rows.joined()) // a fresh layer (and landing) for each visit
                        }
                    }
                }
            }
            .coordinateSpace(name: "studyLayout")
        }
        .background(Color(uiColor: .systemBackground))
        .animation(.easeInOut(duration: 0.2), value: study.paperOpen)
    }
}

/// The line between the page and the Paper. Drag it with a finger to give either side more room.
struct PaneDivider: View {
    let wide: Bool
    let accent: Color
    let onDrag: (CGPoint) -> Void
    @State private var dragging = false

    var body: some View {
        ZStack {
            Color(uiColor: .separator).frame(width: wide ? 1 : nil, height: wide ? nil : 1)
            Capsule()
                .fill(dragging ? accent : Color.secondary.opacity(0.55))
                .frame(width: wide ? 5 : 40, height: wide ? 40 : 5)
        }
        .frame(width: wide ? 14 : nil, height: wide ? nil : 14)
        .frame(maxWidth: wide ? 14 : .infinity, maxHeight: wide ? .infinity : 14)
        .contentShape(Rectangle())
        .gesture(
            DragGesture(minimumDistance: 1, coordinateSpace: .named("studyLayout"))
                .onChanged { v in
                    dragging = true
                    onDrag(v.location)
                }
                .onEnded { _ in dragging = false }
        )
        .ignoresSafeArea()
        .accessibilityLabel("Resize the Paper")
    }
}
