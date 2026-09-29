import SwiftUI

@main
struct CS170WalkthroughApp: App {
    @StateObject private var study = StudyController()

    var body: some Scene {
        WindowGroup {
            StudyLayout(study: study)
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
                Button("Cheat Sheet") { study.send("cheatsheet") }
                    .keyboardShortcut("l", modifiers: .command)
                Button("Shop") { study.send("shop") }
                    .keyboardShortcut("s", modifiers: [.command, .shift])
            }
        }
    }
}

/// The walkthrough, with Apple Pencil paper beside it (landscape) or below it (portrait).
struct StudyLayout: View {
    @ObservedObject var study: StudyController
    @StateObject private var tools = PaperTools()
    private let store = PaperStore()

    var body: some View {
        GeometryReader { geo in
            let wide = geo.size.width > geo.size.height
            // AnyLayout keeps the web view's identity when the iPad rotates.
            let layout = wide ? AnyLayout(HStackLayout(spacing: 0)) : AnyLayout(VStackLayout(spacing: 0))
            layout {
                StudyWebView(controller: study)
                    .ignoresSafeArea()
                    .frame(width: wide && study.paperOpen ? geo.size.width * 0.58 : nil,
                           height: !wide && study.paperOpen ? geo.size.height * 0.5 : nil)
                if study.paperOpen && !study.paperKey.isEmpty {
                    Divider().ignoresSafeArea()
                    PaperPane(key: study.paperKey, label: study.paperLabel, tools: tools, store: store) {
                        study.paperOpen = false
                    }
                }
            }
        }
        .background(Color(uiColor: .systemBackground))
        .animation(.easeInOut(duration: 0.2), value: study.paperOpen)
    }
}
